/*
    coveraje - a simple javascript code coverage tool.
    
    Timer functions
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

(function () {
    "use strict";
    
    function CoverajeTimer() {
        // proxy for setTimeout/setInterval so we can simply stop all timers at the end
        var timeouts = [], intervals = [];
        var mid = Math.random();
        
        (function (t) {
            /*jshint browser: true*/
            t.setTimeout = function (f, ms) {
                var ret = setTimeout.apply(t, arguments);
                timeouts.push(ret);
                return ret;
            };
            
            t.clearTimeout = function (id) {
                clearTimeout(id);
                var idx = timeouts.indexOf(id);
                if (idx !== -1) timeouts.splice(idx, 1);
            };
            
            t.setInterval = function (f, ms) {
                var ret = setInterval.apply(t, arguments);
                intervals.push(ret);
                return ret;
            };
            
            t.clearInterval = function (id) {
                clearInterval(id);
                var idx = intervals.indexOf(id);
                if (idx !== -1) intervals.splice(idx, 1);
            };
            
            t.stopTimers = function () {
                var i, l = timeouts.length;
                for (i = 0; i < l; i++) {
                    clearTimeout(timeouts[i]);
                }
                
                l = intervals.length;
                for (i = 0; i < l; i++) {
                    clearInterval(intervals[i]);
                }
            };
        }(this));
        
        return this;
    }
    
    if (typeof exports !== "undefined" && exports) {
        exports.CoverajeTimer = CoverajeTimer;
    }
}());