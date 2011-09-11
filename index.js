/*global require console */
var fs = require('fs');
var fix = require('./fix');

function fixFile(fileName) {
  return function (line, chr, fn) {
    var file = fs.readFileSync(fileName, 'utf8');
    var lines = file.split("\n");

    lines[line] = fn(lines[line], chr);

    fs.writeFileSync(fileName, lines.join("\n"), 'utf8');
  };
}

function callback(results, data) {
  results.forEach(function (result) {
    var l = fixFile(result.file);

    var error = result.error;
    var raw = error.raw;
    var line = error.line - 1;
    var chr = error.character;

    switch (raw) {
    case "Missing semicolon.":
      l(line, chr, fix.addSemicolon);
      break;
    case "Missing space after '{a}'.":
      l(line, (chr - 1), fix.addSpace);
      break;
    case "'{a}' is already defined.":
      l(line, null, fix.alreadyDefined);
      break;
    default:
    }
  });
}

require('jshint').interpret(process.argv, callback);
