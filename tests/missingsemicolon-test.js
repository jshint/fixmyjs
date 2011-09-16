require('./')("Missing semicolons", {
  "var foo": "var foo;",
  "var foo\nvar bar": "var foo;\nvar bar;",
  "var foo; var bar; var baz": "var foo; var bar; var baz;"
}).export(module);
