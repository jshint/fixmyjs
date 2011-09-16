var errors = require('./errors');

// copies over the results into one of our own objects
function copyResults(result, config) {
  var r = {};

  // copy over
  Object.keys(result.error).forEach(function (key) {
    r[key] = result.error[key];
  });

  // because Array's start at 0.
  r.line -= 1;

  // pass the user config along with it
  r.config = config;

  return r;
}

// checks if this error is fixable, and fixes it
function fixError(r, code) {
  // call fix function
  if (errors.hasOwnProperty(r.raw)) {
    errors[r.raw](r, code);
  }
}

var jshint_autofix = {
  fix: function (str, onComplete, customConfig) {
    var Code = require('./code');

    function callback(results, data, config) {
      var code = new Code(str);

      results.forEach(function (result) {
        // env vars
        var r = copyResults(result, config);

        fixError(r, code);
      });

      onComplete(null, code.toString());
    }

    require('jshint').hint(str, callback);
  },

  run: function () {
    var File = require('./file');
    var dry_run = false;

    function callback(results, data, config) {
      // loop through each error
      results.forEach(function (result) {
        var file = new File(result.file);

        // env vars
        var r = copyResults(result, config);

        fixError(r, file);
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

  }
};

module.exports = jshint_autofix;

