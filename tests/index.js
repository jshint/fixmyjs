var vows = require('vows');
var assert = require('assert');

var jshint_autofix = require('../jshint-autofix');

var ri = function (code) {
  var result = null;
  try {
    result = jshint_autofix(code);
  } catch (err) {
    result = err.message;
  }

  return result;
};

var createTest = function (when, it, test) {
  var topic, result, ret;

  topic = function () {
    return ri(test[when]);
  };

  result = (typeof test[it] === "function") ? function (result) {
    test[it](assert, result);
  } : function (r) {
    assert.equal(r, test[it]);
  };

  ret = {};

  ret.topic = topic;
  ret[it] = result;

  return ret;
};

module.exports = function (description, tests) {
  var batch = {};

  tests.forEach(function (test) {
    var keys = Object.keys(test),
        when = keys.shift(),
        it = keys.shift();

    batch[when] = createTest(when, it, test);
  });

  return vows.describe(description).addBatch(batch);
};
