var File = require('./file');
var errors = require('./errors');

var dry_run = false;

function callback(results, data, config) {
  // loop through each error
  results.forEach(function (result) {
    var file = new File(result.file);

    // env vars
    var r = {};

    // copy over
    Object.keys(result.error).forEach(function (key) {
      r[key] = result.error[key];
    });

    // because Array's start at 0.
    r.line -= 1;

    // pass the user config along with it
    r.config = config;

    // call fix function
    if (errors.hasOwnProperty(r.raw)) {
      errors[r.raw](r, file);
    }
  });

  // do we show diff, or write files?
  if (dry_run) {
    File.showDiff();
  } else {
    File.writeFiles();
  }
}


// runtime
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

