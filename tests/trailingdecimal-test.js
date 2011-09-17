require('./')("Trailing decimals may be confusing", {
  "var foo = 2.;": "var foo = 2;",
  "var foo = 12.;": "var foo = 12;",
  "var foo = 123456789.;": "var foo = 123456789;",
  "var foo = 1.;\nvar bar = 2.;": "var foo = 1;\nvar bar = 2;",
  "var foo = 1.; var bar = 2.;": "var foo = 1; var bar = 2;"
}).export(module);
