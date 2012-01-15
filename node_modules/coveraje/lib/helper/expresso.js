/*
    coveraje - a simple javascript code coverage tool.
    
    expresso-specific helper
    ------------------
    It modifies the expresso source code on the fly (not permanent).
    This could lead to error's in future versions of expresso (or older ones that I have overseen).
    Please report bugs as soon as possible...
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
    See LICENSE in the root folder for more details.
*/

exports.run = function (file, event) {
    "use strict";
    
    var fs = require("fs");
    var expresso;

    try {
        expresso = require.resolve("expresso");
    } catch (ex) {
        event.error("<color yellow>expresso</color> not installed.").complete();
        return;
    }
    
    fs.readFile(expresso, 'utf-8', function (experr, expdata) {
        var path = require("path"),
            vm = require("vm");
        
        if (experr) {
            event.error("<color yellow>expresso</color> not installed.").complete();
            return;
        }

        if (expdata.substr(0, 2) === "#!") {
            expdata = expdata.substr(expdata.indexOf("\n") + 1);
        }
        
        var m = expdata.match(/\n(?:if \(!defer\))/);
        if (m && m.index !== -1) {
            expdata = expdata.substr(0, m.index);
        }
        
        var x = vm.createScript(expdata, "expresso");
        var ctx = vm.createContext({
            /*jshint browser: true*/
            require: require,
            process: process,
            console: console,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout
        });
        
        // hack: simulate console run
        ctx.process.argv = ["node", "expresso", "--boring"];
        
        var cwd = process.cwd();
        
        var p = path.resolve(file);
        file = path.basename(file);
        
        process.chdir(path.dirname(p));
        
        x.runInNewContext(ctx);
        
        var rf;
        if (typeof ctx.runFiles === "function") {
            rf = ctx.runFiles;
            file = [file];
        } else if (typeof ctx.runFile === "function") {
            rf = ctx.runFile;
        } else if (typeof ctx.run === "function") {
            rf = ctx.run;
            file = [file];
        } else {
            event.error("Neither runFiles(), runFile(), nor run() found in expresso").complete();
            return;
        }
        
        // prevent reports from output after process emits "exit"
        if (ctx.process != null) {
            ctx.process.removeAllListeners("exit");
            if (typeof ctx.orig !== "undefined") {
                ctx.process.emit = ctx.orig;
            }
        }
        
        try {
            rf(file);
        } catch (ex) {
            event.error(ex).complete();
            return;
        } finally {
            process.chdir(cwd);
        }
        
        // report failures
        if (typeof ctx.reportFailures !== "undefined") {
            ctx.reportFailures();
        }
        
        event.complete();
    });
};


