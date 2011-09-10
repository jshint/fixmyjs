/*global require console */
var fs = require('fs');
var fix = require('./fix');

function fixFile(fileName) {
  return function (fn) {
    var file = fs.readFileSync(fileName, 'utf8');
    var lines = file.split("\n");

    var result = fn(lines);

    fs.writeFileSync(fileName, result.join("\n"), 'utf8');
  };
}

function callback(results, data) {
  results.forEach(function (result) {
    var l = fixFile(result.file);

    var error = result.error;
    var reason = error.reason;
    var line = error.line - 1;
    var chr = error.character;

    switch (reason) {
    case "Missing semicolon.":
      l(function (lines) {
        lines[line] = fix.addSemicolon(lines[line], chr);
        return lines; // figure out so we don't have to return lines always...
      });
      break;
    default:
    }
  });
}

require('jshint').interpret(process.argv, callback);
