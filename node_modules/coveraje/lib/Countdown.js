/*
    coveraje - a simple javascript code coverage tool.
    
    Countdown
    ------------
    Event emitter that raises "complete" after x "onComplete"s
    or "error" after y milliseconds
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

(function () {
    "use strict";
    
    var CoverajeEvent = require("./EventEmitter").CoverajeEvent;
    
    function Countdown(event, count, wait) {
        var tim;
        
        (function (t) {
            if (event instanceof CoverajeEvent) {
                t.one = function () {
                    count--;
                    if (count === 0) {
                        if (tim) clearTimeout(tim);
                        event.complete();
                    }
                    return t;
                };
                
                var w = Number(wait);
                if (w != null && !isNaN(w) && isFinite(w) && count > 0) {
                    tim = setTimeout(function () {
                        count = 0;
                        event.error("Test cancelled after <color yellow>" + (w / 1000).toPrecision(3).replace(/\.?0+$/, "") + "</color> seconds.");
                        event.complete();
                    }, w);
                }
            } else {
                t.one = function () {
                    return t;
                };
            }
        }(this));
        return this;
    }
    
    if (typeof exports !== "undefined" && exports) {
        exports.Countdown = Countdown;
    }
}());