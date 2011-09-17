require('./')("Array literal should be used instead of constructor", {
  "var foo = new Array();": "var foo = [];",
  "var foo = new Array(); var bar = new Array();": "var foo = []; var bar = [];"
}).export(module);
