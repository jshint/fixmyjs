/*
    coveraje - a simple javascript code coverage tool.
    
    helper for tests without a test helper (so they can report that all tests are over)
    it's needed if the test has async calls
    
    Copyright (c) 2011 Wolfgang Kluge (klugesoftware.de, gehirnwindung.de)
*/

exports.createTestContext = function (exports) {
    "use strict";
    
    var otcs = [];
    var counter = 0;
    
    exports.onTestComplete = function (otc) {
        if (typeof otc === "function") {
            otcs.push(otc);
        }
    };
    
    function emitTestComplete() {
        for (var i = 0, l = otcs.length; i < l; i++) {
            otcs[i]();
        }
    }
    
    return {
        add: function () {
            counter++;
        },
        end: function () {
            counter--;
            if (counter === 0) {
                emitTestComplete();
            }
        },
        stop: function () {
            counter = 0;
            emitTestComplete();
        }
    };
};