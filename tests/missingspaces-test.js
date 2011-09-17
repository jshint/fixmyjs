require('./')("Missing Spaces", {
  "var a = function() {};": "var a = function () {};",
  "var b=function(){};": "var b = function () {};",
  "var c=12;var d=13;var e=14;var g=15;": "var c = 12; var d = 13; var e = 14; var g = 15;",
  "var d= false;": "var d = false;",
  "var j ='hello world';": "var j = 'hello world';",
  "function h(){\n\treturn 1;}": "function h() {\n\treturn 1; }"
}).export(module);
