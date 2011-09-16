require('./')("Unnecessary semicolons", {
  "if (true) { };": "if (true) { }",
  "function foo() { };": "function foo() { }",
  "function foo() {\n};": "function foo() {\n}",
  "if (true) {\n};": "if (true) {\n}",
  "function foo() { };function bar() { };": "function foo() { } function bar() { }"
}).export(module);
