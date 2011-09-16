require('./')("Leading decimals may be confusing", {
  "var foo = .2;": "var foo = 0.2;",
  "var foo = .12;": "var foo = 0.12;",
  "var foo = .123456789;": "var foo = 0.123456789;",
  "var foo = .1;\nvar bar = .2;": "var foo = 0.1;\nvar bar = 0.2;",
  "var foo = .1; var bar = .2;": "var foo = 0.1; var bar = 0.2;"
}).export(module);
