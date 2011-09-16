require('./')("Variables don't need to be redefined", {
  "(function () { var foo = true;\nvar foo = false; }());": "(function () { var foo = true;\nfoo = false; }());"
}).export(module);
