var File = require('./lib/code');
var errors = require('./lib/errors');

module.exports = function (code, config) {
  config = config || {};
  var jshint = require('jshint').JSHINT;
  var file = new File(code);
  jshint(code, config);
  jshint.errors.forEach(function (error) {
    // env vars
    var r = {};

    // copy over
    Object.keys(error).forEach(function (key) {
      r[key] = error[key];
    });

    // because Array's start at 0.
    r.line = code;

    // pass the user config along with it
    r.config = config;

    // call fix function
    if (errors.hasOwnProperty(r.raw)) {
      errors[r.raw](r, file);
    }
  });
  return file.code;
};

