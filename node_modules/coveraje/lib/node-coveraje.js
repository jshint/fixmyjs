/*
    coveraje - a simple javascript code coverage tool.

    entry point for node

    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

var coveraje = (function () {
    "use strict";

    var uglifyjs = require("uglify-js"),
        CoverajeEvent = require("./EventEmitter").CoverajeEvent,
        Coveraje = require("./core").Coveraje,
        coverajeWebserver = require("./webserver").coverajeWebserver,
        utils = require("./utils").utils,
        runHelper = require("./runHelper").runHelper;

    var isOwn = utils.isOwn;

    function runInConsole(options, instance) {
        var hasError = false;
        var mr = instance.createRunner();
        var runtime = instance.runtime;
        var shell = require("./shell").createShell(utils.doOptions(options, Coveraje.defaultOptions));

        mr
            .onComplete(function (key, context) {
                var data = runtime.reportData();
                var vl, vlt, clt = 0, cl = 0;

                vl = data.visited.length;
                cl += vl;

                shell.writeLine("");
                shell.writeLine("         |  Items Tested | Coverage |");
                shell.writeLine("---------+---------------+----------+");
                if (vl > 0) {
                    vlt = data.visited.filter(runtime.visit.isTested).length;
                    clt += vlt;
                    shell.writeLine("Visits   |  <color bright white>%5d  %5d</color> |  <color bright white>%6s%</color> |", vl, vlt, (vlt / vl * 100).toFixed(2));
                }

                vl = data.branches.length;
                cl += vl;
                if (vl > 0) {
                    vlt = data.branches.filter(runtime.branch.isTested).length;
                    clt += vlt;
                    shell.writeLine("Branches |  <color bright white>%5d  %5d</color> |  <color bright white>%6s%</color> |", vl, vlt, (vlt / vl * 100).toFixed(2));
                }
                shell.writeLine("---------+---------------+----------+");

                if (cl > 0) {
                    shell.writeLine("Total    |  <color bright white>%5d  %5d</color> |  <color bright white>%6s%</color> |", cl, clt, (clt / cl * 100).toFixed(2));
                }
            })
            .onError(function (key, err) {
                if (!hasError) {
                    hasError = true;
                    shell.writeLine("<color bright red>Errors:</color>");
                }
                shell.writeLine(key + ": <color bright white>" + err + "</color>");
            })
            .start();
    }

    var cj = {
        version: Coveraje.version,

        cover: function (code, runner, options, onComplete) {
            if (coverajeWebserver.handles(options)) {
                coverajeWebserver
                    .create(code, runner, options, onComplete)
                    .start();
            } else {
                var inst = new Coveraje(code, runner, options);

                if (inst.isInitialized) {
                    if (typeof onComplete === "function") {
                        inst.onComplete(onComplete);
                    }

                    runInConsole(options, inst);
                }
            }
        },

        // helper for test runners
        runHelper: runHelper
    };

    if (typeof exports !== "undefined" && exports) {
        exports.coveraje = cj;
    }
    return cj;
}());
