require('./')("Invocation inside the parenthesis of anon function", {
  "(function () { })();": "(function () { }());",
  "(function () {\n})();": "(function () {\n}());",
  "(function () { })(); (function () { })();": "(function () { }()); (function () { }());"
}).export(module);
