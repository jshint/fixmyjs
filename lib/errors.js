var fix = require('./fix');
var errors = {
  "'{a}' is already defined.": function (r, file) {
    file.fix(r.line, null, fix.alreadyDefined);
  },

  "['{a}'] is better written in dot notation.": function (r, file) {
    file.fix(r.line, null, fix.dotNotation);
  },

  "Missing semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(r.line, (r.character + chr), fix.addSemicolon);
  },

  "Missing space after '{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(r.line, ((r.character + r.a.length - 1) + chr), fix.addSpace);
  },

  "Expected '{a}' to have an indentation at {b} instead at {c}.": function (r, file) {
    file.fix(r.line, r.b, fix.indent);
  },

  "Unnecessary semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(r.line, (r.character + chr - 1), fix.rmSemicolon);
  }
};

module.exports = errors;
