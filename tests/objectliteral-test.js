require('./')("Object literal should be used instead of constructor", {
  "var foo = new Object();": "var foo = {};"
}).export(module);
