require('./')("Missing semicolons", {
  "var foo": "var foo;",
  "var foo\nvar bar": "var foo;\nvar bar;",
  "var foo; var bar; var baz": "var foo; var bar; var baz;",
  "function foo() { return 1 } function bar() { return 2 }": "function foo() { return 1; } function bar() { return 2; }",
  "function foo() {\n\treturn 1\n}\nfunction bar() {\n\treturn 2\n}": "function foo() {\n\treturn 1;\n}\nfunction bar() {\n\treturn 2;\n}"
}).export(module);
