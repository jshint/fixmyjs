var fix = require('./fix');
var errors = {
  "Missing semicolon.": function (r, fn) {
    fn.readAndFix(r.line, r.chr, fix.addSemicolon);
  },

  "Missing space fater '{a}'.": function (r, fn) {
    fn.readAndFix(r.line, (r.chr - 1), fix.addSpace);
  },

  "'{a}' is already defined.": function (r, fn) {
    fn.readAndFix(r.line, null, fix.alreadyDefined);
  }
};

module.exports = errors;
