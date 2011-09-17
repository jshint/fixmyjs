require('./')("Constructors need invocation", {
  "var foo = new Foo;": "var foo = new Foo();",
  "var foo = new Foo; var bar = new Bar;": "var foo = new Foo(); var bar = new Bar();",
  "var foo = new Foo; var baz = new Baz(); var bar = new Bar;": "var foo = new Foo(); var baz = new Baz(); var bar = new Bar();",
  "var foo = new Foo;\nvar baz = new Baz();\nvar bar = new Bar;": "var foo = new Foo();\nvar baz = new Baz();\nvar bar = new Bar();"
}).export(module);
