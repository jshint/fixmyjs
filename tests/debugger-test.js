require('./')("Debugger stmts removed", {
  "debugger;": "",
  "debugger;debugger;debugger;": "",
  "debugger;\ndebugger;\ndebugger;": "\n\n"
}).export(module);
