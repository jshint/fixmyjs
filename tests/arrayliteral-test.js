require('./')("Array literal should be used instead of constructor", {
  "var foo = new Array();": "var foo = [];"
}).export(module);
