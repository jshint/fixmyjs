require('./')("Use isNaN rather than comparing to NaN", {
  "var a = (16 == NaN);": "var a = isNaN(16);",
  "var a = (5 !== NaN);": "var a = !isNaN(5);",
  "var a = ('hello world' != NaN);": "var a = !isNaN('hello world');",
  "var a = ([1, 2, 3, 4] === NaN);": "var a = isNaN([1, 2, 3, 4]);"
}).export(module);
