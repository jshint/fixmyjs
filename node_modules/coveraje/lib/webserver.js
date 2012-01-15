/*
    coveraje - a simple javascript code coverage tool.
    
    the webserver
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

(function () {
    "use strict";

    var defaultOptions = {
        serverHost: "127.0.0.1",
        serverPort: 13337,
        useServer: false
    };
    
    var utils = require("./utils").utils;
    var isOwn = utils.isOwn;
    
    function create(code, runner, options, onComplete) {
        var Coveraje = require("./core").Coveraje,
            uglifyjs = require("uglify-js"),
            fs = require("fs"),
            path = require("path"),
            http = require("http"),
            url = require("url"),
            server,
            colors;
        var option = utils.doOptions(options, Coveraje.defaultOptions, defaultOptions);
        var shell = require("./shell").createShell(option);
        
        function writeString(data, res, status, contentType) {
            var headers = {};
            if (contentType) {
                headers["Content-Type"] = contentType;
            }
            res.writeHead(status, headers);
            res.end(data);
        }
        
        function writeError(res, status, text) {
            shell.writeLine(text);
            res.writeHead(status, text);
            res.end();
        }
        
        function writeFile(filename, res, contentType) {
            fs.readFile(path.resolve(__dirname, filename), function (err, data) {
                if (err) {
                    writeError(res, 404, err);
                } else {
                    writeString(data, res, 200, contentType);
                }
            });
        }
        
        // colorize some of the tokens
        function colorizer(code) {
            var ret = {};
            var nexttoken = uglifyjs.parser.tokenizer(code);
            
            function color(type, pos, endpos) {
                if (!(type in ret)) ret[type] = [];
                ret[type].push({s: pos, e: endpos});
            }
            
            for (;;) {
                var token = nexttoken();
                var cs = token.comments_before;
                
                if (cs) {
                    var cl = cs.length;
                    for (var i = 0; i < cl; i++) {
                        color("comment", cs[i].pos, cs[i].endpos);
                    }
                }
                if (token.type === "eof") break;
                
                switch (token.type) {
                    /*jshint white: false*/
                    case "keyword":
                    case "string":
                    case "num":
                    case "regexp":
                        color(token.type, token.pos, token.endpos);
                        break;
                    case "name":
                        if (token.value === "true" || token.value === "false") {
                            color("boolean", token.pos, token.endpos);
                        }
                        break;
                }
                
            }
            return ret;
        }
        
        function writeInitValues(instance, res) {
            var runnerKeys = [];
            if (typeof runner !== "function") {
                for (var rx in runner) {
                    if (isOwn(runner, rx)) {
                        runnerKeys.push(rx);
                    }
                }
            }
            
            writeString(
                JSON.stringify({
                    version: Coveraje.version,
                    options: option,
                    runner: runnerKeys,
                    code: instance.code,
                    skippedLines: instance.skippedLines,
                    colors: colorizer(instance.code)
                }),
                res, 200, "application/json"
            );
        }
        
        function start() {
            var instance = new Coveraje(code, runner, options);
            var isRefresh = false;
            
            if (instance.isInitialized) {
                if (typeof onComplete === "function") {
                    instance.onComplete(onComplete);
                }
                
                server = http.createServer(function (req, res) {
                    var requrl = url.parse(req.url, true);
                    var pathname = requrl.pathname.toLowerCase();
                    switch (pathname) {
                        /*jshint white: false*/
                        
                        case "/": // main (create instance, exec code)
                            if (isRefresh) {
                                instance.load(code);
                            } else {
                                isRefresh = true;
                            }
                            
                            writeFile("../webserver/coveraje.html", res, "text/html");
                            break;
                            
                        case "/coveraje.json": // options and results
                            if (instance != null) {
                                var rk;
                                
                                if (requrl.query) {
                                    if (requrl.query.init) {
                                        // get initial values
                                        writeInitValues(instance, res);
                                        break;
                                        
                                    } else if (requrl.query.runnerid) {
                                        // run single test
                                        rk = requrl.query.runnerid;
                                        if (rk) {
                                            if (!isOwn(runner, rk)) {
                                                writeError(res, 400, "Runner with id '" + rk + "' undefined");
                                                break;
                                            } else if (typeof runner[rk] !== "function") {
                                                writeError(res, 400, "Runner with id '" + rk + "' is not a function");
                                                break;
                                            }
                                        }
                                    }
                                }
                                
                                // run the test(s)
                                var mr = instance.createRunner();
                                mr
                                    .onError(function (key, msg) {
                                        shell.writeLine("%s: <color bright white>%s</color>", key, msg);
                                    })
                                    .onComplete(function (key, context) {
                                        writeString(
                                            JSON.stringify(instance.runtime.reportData()),
                                            res, 200, "application/json"
                                        );
                                    })
                                    .start(rk);
                            } else {
                                res.writeHead(500);
                                res.end();
                            }
                            break;

                        default:
                            if (pathname.indexOf("?") === -1 && pathname.indexOf("..") === -1) {
                                var phys = path.resolve(__dirname, "../webserver" + pathname);
                                if (path.existsSync(phys)) {
                                    var ct;
                                    switch (path.extname(phys)) {
                                        case ".gif":
                                            ct = "image/gif";
                                            break;
                                        case ".png":
                                            ct = "image/png";
                                            break;
                                        case ".jpg":
                                            ct = "image/jpeg";
                                            break;
                                        case ".css":
                                            ct = "text/css";
                                            break;
                                        case ".html":
                                            ct = "text/html";
                                            break;
                                        case ".js":
                                            ct = "application/javascript";
                                            break;
                                    }
                                    if (ct) {
                                        writeFile(phys, res, ct);
                                        break;
                                    }
                                }
                            }
                            res.writeHead(404);
                            res.end();
                            break;
                    }

                });

                server.listen(option.serverPort, option.serverHost);
                shell.writeLine("Server running at <color bright white>http://%s:%d/</color>", option.serverHost, option.serverPort);
                
            } else {
                shell.writeLine("Cannot start instance.");
            }
        }

        function stop() {
            if (server) {
                server.stop();
            }
        }
        
        return {
            start: start,
            stop: stop
        };
    }
    
    if (typeof exports !== "undefined" && exports) {
        exports.coverajeWebserver = {
            handles: function (options) {
                return !!utils.doOptions(options, defaultOptions).useServer;
            },
            create: create
        };
    }
}());
