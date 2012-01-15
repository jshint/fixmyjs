/*
    coveraje - a simple javascript code coverage tool.
    
    run helper
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

(function () {
    "use strict";
    
    var CoverajeEvent = require("./EventEmitter").CoverajeEvent,
        Countdown;

    function createEmitter(f) {
        if (typeof f === "function") {
            var event = new CoverajeEvent();
            
            event.onStart(function () {
                f(event);
            });
            
            return event;
        }
        return null;
    }
    
    var runHelper = function (framework, options) {
        return {
            run: function (file) {
                return createEmitter(function (event) {
                    require("./helper/index").run(file, framework, event, options);
                });
            }
        };
    };
    
    runHelper.createCountdown = function (event, count, wait) {
        if (typeof Countdown === "undefined") {
            Countdown = require("./Countdown").Countdown;
        }
        
        var c = Number(count);
        if (isNaN(c) || !isFinite(c) || c < 1) c = 1;
        var w = Number(wait);
        if (wait == null || isNaN(w) || !isFinite(w) || w < 0) w = 1000 * 5;
        
        return new Countdown(event, c, w);
    };
    
    runHelper.createEmitter = createEmitter;
    
    if (typeof exports !== "undefined" && exports) {
        exports.runHelper = runHelper;
    }
}());