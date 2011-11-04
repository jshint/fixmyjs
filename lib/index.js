var errors = require('./errors');
var File = require('./file');
var EventEmitter = require('events').EventEmitter;

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
    errors[r.raw].fix(r, code);
  }
}

function fixErrors(config) {
  return function (result) {
    var file = new File(result.file);
    var r = copyResults(result, config);
    fixError(r, file);
  };
}

function byPriority(a, b) {
  a = a.error;
  b = b.error;

  var p1 = errors[a.raw].priority;
  var p2 = errors[b.raw].priority;

  if (p1 === p2) {
    if (a.line === b.line) {
      return b.character - a.character;
    } else {
      return b.line - a.line;
    }
  } else {
    return p1 - p2;
  }
}

function callback(results, data, config) {
  // filter out errors we don't support.
  results = results.filter(function (v) {
    return errors.hasOwnProperty(v.error.raw);
  });

  // sort errors.
  results.sort(byPriority);

  // fix them.
  results.forEach(fixErrors(config));

  this.emit("done", File);
}

var jshint_autofix = {
  run: function (args, ev) {
    ev = ev || new EventEmitter();
    require('jshint').interpret(args, callback.bind(ev));
  }
};

module.exports = jshint_autofix;
