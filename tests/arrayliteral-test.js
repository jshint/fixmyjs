var code = function (original) {
  var tests = [];
  Object.keys(original).forEach(function (comp) {
    var test = {};
    var result = original[comp];

    test[comp] = comp;
    test["-> " + result] = result;
    tests.push(test);
  });

  return tests;
};

var tests = {
  "var foo = new Array();": "var foo = [];"
};

require('./')("Array literal should be used instead of constructor", code(tests)).export(module);
