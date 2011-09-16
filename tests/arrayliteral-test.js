/*
var code = function (original) {
  var tests = [];
  Object.keys(original).forEach(function (comp) {
    var test = {};
    var result = original[comp];

    test[comp] = comp;
    test["-> " + result] = result;
    tests.push(test);
  });

  return tests;
};

var tests = {
  "var foo = new Array();": "var foo = [];"
};

require('./')("Array literal should be used instead of constructor", code(tests)).export(module);
*/

var vows = require('vows');
var assert = require('assert');
var jshint = require('../lib/');

vows.describe("Array literal should be used instead of constructor").addBatch({
  'when using an array constructor': {
    topic: function () {
      jshint.fix("var foo = new Array();", this.callback);
    },

    'it is converted to an array literal': function (topic) {
      assert.equal(topic, "var foo = [];");
    }
  }
}).export(module);
