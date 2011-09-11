var fix = require('./fix');
var errors = {
  "Missing semicolon.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(r.line, r.character + chr, fix.addSemicolon);
  },

  "Missing space after '{a}'.": function (r, file) {
    var chr = file.getLineChrDiff(r.line);
    file.fix(r.line, ((r.character + r.a.length - 1) + chr), fix.addSpace);
  },

  "'{a}' is already defined.": function (r, file) {
    file.fix(r.line, null, fix.alreadyDefined);
  },

  "['{a}'] is better written in dot notation.": function (r, file) {
    file.fix(r.line, null, fix.dotNotation);
  }
};

module.exports = errors;
