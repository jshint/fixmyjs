require('./')("Variables don't need to be initialized to undefined", {
  "var foo = undefined;": "var foo;",
  "var foo = undefined; var bar = undefined;": "var foo; var bar;",
  "var foo = undefined;\nvar bar = undefined;": "var foo;\nvar bar;"
}).export(module);
