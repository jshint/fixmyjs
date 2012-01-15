/*
    coveraje - a simple javascript code coverage tool.
    
    common helper
    --------------------------
    loads a specific tdd framework helper if requested and runs the file
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
    See LICENSE in the root folder for more details.
*/

exports.run = function (testPath, framework, event, options) {
    "use strict";
    
    var fwh;
    if (framework != null) {
        try {
            fwh = require("./" + framework);
        } catch (ex1) {
            event
                .error("TDD framework helper '" + framework + "'\n" + ex1.message)
                .complete();
            return;
        }
    }
    var fullPath = require("path").resolve(testPath);
    
    // hack: delete from cache if present
    if (fullPath in require.cache) delete require.cache[fullPath];
    
    if (fwh != null) {
        fwh.run(testPath, event, options);
    } else {
        var hasOnReady;
        try {
            var otc = require(fullPath).onTestComplete;
            if (typeof otc == "function") {
                hasOnReady = true;
                otc(function () {
                    event.complete();
                });
            }
        } catch (ex2) {
            event.error(ex2);
        }
        if (!hasOnReady) {
            event.complete();
        }
    }
};