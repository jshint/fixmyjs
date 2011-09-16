var vows = require('vows');
var assert = require('assert');
var jshint = require('../lib/');

var test = function (name, specs) {

  var tests = {};

  Object.keys(specs).forEach(function (spec) {
    var result = specs[spec];

    tests[spec] = {
      topic: function () {
        jshint.fix(spec, this.callback);
      }
    }

    tests[spec][result] = function (topic) {
      assert.equal(topic, result);
    }
  });


  return vows.describe(name).addBatch(tests);
};

module.exports = test;

