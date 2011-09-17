require('./')("Invocation inside the parenthesis of anon function", {
  "(function () { })();": "(function () { }());",
  "(function () {\n})();": "(function () {\n}());"
}).export(module);
