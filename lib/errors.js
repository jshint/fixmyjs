var fix = require('./fix');
var errors = {
  "'{a}' is already defined.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.alreadyDefined, r.line, r.a);
    }
  },

  "['{a}'] is better written in dot notation.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.dotNotation, r.line, r.a);
    }
  },

  "A leading decimal point can be confused with a dot: '.{a}'.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.leadingDecimal, r.line);
    }
  },

  "A trailing decimal point can be confused with a dot '{a}'.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.trailingDecimal, r.line);
    }
  },

  "All 'debugger' statements should be removed.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.rmDebugger, r.line);
    }
  },

  "Expected '{a}' to have an indentation at {b} instead at {c}.": {
    priority: 1,
    fix: function (r, file) {
  //    file.fix(fix.indent, r.line, r.b, r.config);
    }
  },

  "It is not necessary to initialize '{a}' to 'undefined'.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.rmUndefined, r.line);
    }
  },

  "Line breaking error '{a}'.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.lineBrk, r.line, r.line, (r.line + 1));
    }
  },

  "Missing '()' invoking a constructor.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.invokeConstructor, r.line);
    }
  },

  "Missing semicolon.": {
    priority: 0,
    fix: function (r, file) {
      file.fix(fix.addSemicolon, r.line, file.getChr(r));
    }
  },

  "Missing space after '{a}'.": {
    priority: 0,
    fix: function (r, file) {
      file.fix(fix.addSpace, r.line, file.getChr(r));
    }
  },

  "Mixed spaces and tabs.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.mixedSpacesNTabs, r.line, r.config);
    }
  },

  "Move the invocation into the parens that contain the function.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.anonFuncInvocation, r.line);
    }
  },

  "Too many errors.": {
    priority: 2,
    fix: function () {
    }
  },

  "Unexpected space after '{a}'.": {
    priority: 0,
    fix: function (r, file) {
      file.fix(fix.rmChar, r.line, file.getChr(r));
    }
  },

  "Unnecessary semicolon.": {
    priority: 0,
    fix: function (r, file) {
      file.fix(fix.rmChar, r.line, file.getChr(r));
    }
  },

  "Use the isNaN function to compare with NaN.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.useIsNaN, r.line);
    }
  },

  "Use the array literal notation [].": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.arrayLiteral, r.line);
    }
  },

  "Use the object literal notation {}.": {
    priority: 1,
    fix: function (r, file) {
      file.fix(fix.objectLiteral, r.line);
    }
  }
};

module.exports = errors;
