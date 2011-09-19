require('./')("Mixed spaces and tabs", {
  "\t  \t\tvar a = true;": "        var a = true;"
}).export(module);
