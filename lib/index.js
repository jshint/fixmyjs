/*global require console */
var fs = require('fs');
var fix = require('./fix');

var dry_run = false;

function fixFile(fileName) {
  return function (line, chr, fn) {
    var file = fs.readFileSync(fileName, 'utf8');
    var lines = file.split("\n");

    lines[line] = fn(lines[line], chr);

    // TODO show a colored diff.
    if (dry_run) {
      process.stdout.write(fileName + "\n");
      process.stdout.write(lines.join("\n") + "\n");
    } else {
      fs.writeFileSync(fileName, lines.join("\n"), 'utf8');
    }
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
    }
  });
}

switch (process.argv[2]) {
case "--help":
  var help = [
              "       jslint-autofix",
              "",
              "  --dry-run  for a dry run",
              "  --help     this message",
              ""
  ];
  process.stdout.write(help.join("\n"));
  break;
case "--dry-run":
  dry_run = true;
  process.argv.splice(2, 1);
  /* falls through */
default:
  require('jshint').interpret(process.argv, callback);
}

