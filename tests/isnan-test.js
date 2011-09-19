require('./')("Use isNaN rather than comparing to NaN", {
  "var a = (b == NaN);": "var a = (isNaN(b));"
}).export(module);
