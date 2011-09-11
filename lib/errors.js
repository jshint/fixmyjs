var fix = require('./fix');
var errors = {
  "'{a}' is already defined.": function (r, file) {
    file.fix(fix.alreadyDefined, r.line);
  },

  "['{a}'] is better written in dot notation.": function (r, file) {
    file.fix(fix.dotNotation, r.line);
  },

  "A leading decimal point can be confused with a dot: '.{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.leadingDecimal, r.line, (r.character + chr - 1));
  },

  "A trailing decimal point can be confused with a dot '{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    // why -2? because -1 since the column positioning is off by 1, and -1 since Arrays start at 0.
    file.fix(fix.rmChar, r.line, (r.character + chr - 2));
  },

  "All 'debugger' statements should be removed.": function (r, file) {
    file.fix(fix.rmDebugger, r.line);
  },

  "Expected '{a}' to have an indentation at {b} instead at {c}.": function (r, file) {
    file.fix(fix.indent, r.line, r.b, r.config);
  },

  "It is not necessary to initialize '{a}' to 'undefined'.": function (r, file) {
    file.fix(fix.rmUndefined, r.line);
  },

  "Missing '()' invoking a constructor.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.invokeConstructor, r.line, (r.character + chr - 1));
  },

  "Missing semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.addSemicolon, r.line, (r.character + chr));
  },

  "Missing space after '{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.addSpace, r.line, ((r.character + r.a.length - 1) + chr));
  },

  "Mixed spaces and tabs": function (r, file) {
    file.fix(fix.mixedSpacesNTabs, r.line, r.config);
  },

  "Unexpected space after '{a}'.": function (r, file) {
//    var chr = file.getLineChrDiff(r.line);
//    file.fix(fix.rmChar, r.line, (r.character + chr - 1));
  },

  "Unnecessary semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.rmChar, r.line, (r.character + chr - 1));
  },

  "Use the isNaN function to compare with NaN.": function (r, file) {
    file.fix(fix.useIsNaN, r.line);
  },

  "Use the array literal notation [].": function (r, file) {
    file.fix(fix.arrayLiteral, r.line);
  },

  "Use the object literal notation {}.": function (r, file) {
    file.fix(fix.objectLiteral, r.line);
  }
};

module.exports = errors;
