var fix = require('./fix');
var errors = {
  "'{a}' is already defined.": function (r, file) {
    file.fix(fix.alreadyDefined, r.line);
  },

  "['{a}'] is better written in dot notation.": function (r, file) {
    file.fix(fix.dotNotation, r.line);
  },

  "Expected '{a}' to have an indentation at {b} instead at {c}.": function (r, file) {
    file.fix(fix.indent, r.line, r.b);
  },

  "Missing semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.addSemicolon, r.line, (r.character + chr));
  },

  "Missing space after '{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.addSpace, r.line, ((r.character + r.a.length - 1) + chr));
  },

  "Unnecessary semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(fix.rmSemicolon, r.line, (r.character + chr - 1));
  }
};

module.exports = errors;
