require('./')("Missing Spaces", {
  "var a = function() {};": "var a = function () {};",
  "var b=function(){};": "var b = function () {};",
  "var c=12;var d=13;var e=14;var g=15;": "var c = 12; var d = 13; var e = 14; var g = 15;"
}).export(module);
