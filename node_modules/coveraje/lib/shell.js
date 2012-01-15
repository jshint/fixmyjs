/*
    coveraje - a simple javascript code coverage tool.
    
    shell
    ------------
    helper for output values to shell
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

(function () {
    "use strict";
    
    var util = require("util");
    
    function createShell(option) {
        var formatRegExp = /%(\d*)([sdj%])(\d*)/g,
            colorRegExp = /<(?:(\/color)|(?:color\s+(\w+(?:\s+\w+)*)\s*))>/g;
            
        function format(f) {
            var i;
            if (typeof f !== "string") {
                var objects = [];
                for (i = 0; i < arguments.length; i++) {
                    objects.push(util.inspect(arguments[i]));
                }
                return objects.join(" ");
            }

            i = 1;
            var args = arguments;
            var len = args.length;
            var str = f.replace(formatRegExp, function (x, padl, type, padr) {
                var ret;
                if (type === "%") {
                    ret = "%";
                } else if (i >= len) {
                    ret = x;
                }
                
                switch (type) {
                    /*jshint white: false */
                    case "s":
                        ret = String(args[i++]);
                        break;
                    case "d":
                        ret = Number(args[i++]).toString();
                        break;
                    case "j":
                        ret = JSON.stringify(args[i++]);
                        break;
                    default:
                        ret = x;
                        break;
                }
                
                if (padl !== "") {
                    padl = parseInt(padl, 10);
                    if (ret.length < padl) {
                        ret = new Array(padl - ret.length + 1).join(" ") + ret;
                    }
                }
                if (padr !== "") {
                    padr = parseInt(padr, 10);
                    if (ret.length < padr) {
                        ret = ret + new Array(padr - ret.length + 1).join(" ");
                    }
                }
                
                return ret;
            });
            
            for (var x = args[i]; i < len; x = args[++i]) {
                if (x === null || typeof x !== "object") {
                    str += " " + x;
                } else {
                    str += " " + util.inspect(x);
                }
            }
            return str;
        }
        
        var colorDef = [
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "pink",
            "cyan",
            "white"
        ];
        
        function colorize(txt) {
            var curr = [];
            var reset = "\x1B[m";
            var last = reset;
            return txt.replace(colorRegExp, function (m, close, names) {
                if (option.colorizeShell) {
                    if (close) {
                        if (curr.length === 0) {
                            last = reset;
                            return "";
                        }
                        last = curr.pop();
                        return last;
                    } else {
                        curr.push(last);
                        
                        var colors = names.split(/\s+/g);
                        var l = colors.length;
                        
                        var fg, bg, mod = "[";
                        
                        for (var i = 0; i < colors.length; i++) {
                            var color = colors[i];
                            var idx = colorDef.indexOf(color);
                            if (idx === -1) {
                                if (color === "normal") {
                                    mod += "0;";
                                } else if (color === "bright") {
                                    mod += "1;";
                                } else if (color === "inverted") {
                                    mod += "7;";
                                }
                            } else {
                                if (fg == null) {
                                    fg = 30 + idx;
                                } else if (bg == null) {
                                    bg = 40 + idx;
                                }
                            }
                        }
                        
                        if (fg != null) {
                            last = "\x1B" + mod + fg;
                            if (bg != null) {
                                last += ";" + bg;
                            }
                            last += "m";
                            return last;
                        }
                    }
                }
                return "";
            });
        }
        
        var ret = {
            format: format,
            colorize: colorize
        };
        
        if (option.quiet) {
            ret.write = function () {};
            ret.writeLine = ret.write;
        } else {
            ret.writeLine = function (text) {
                console.log(colorize(format.apply(this, arguments)));
            };
            ret.write = function (text) {
                process.stdout.write(colorize(format.apply(this, arguments)));
            };
        }
        
        return ret;
    }
    
    if (typeof exports !== "undefined" && exports) {
        exports.createShell = createShell;
    }
}());