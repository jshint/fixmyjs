var vows = require('vows');
var assert = require('assert');
var jshint = require('../packages/jshint/jshint').JSHINT;
var fs = require('fs');

var tests;

if (process.argv[1].indexOf("vows") === -1 && process.argv[2]) {
  tests = [process.argv[2]];
} else {
  tests = fs.readdirSync(__dirname + "/fixtures/broken/");
}

var fixmyjs = require((process.argv[3] && process.argv[3].indexOf("--cover") !== -1) ? '../jscoverage/fixmyjs' : '../fixmyjs');

var specs = {};

tests.forEach(function (test) {
  var file_n = __dirname + "/fixtures/broken/" + test;
  var file_y = __dirname + "/fixtures/ok/" + test;

  var spec = {};
  spec["?"] = {
    topic: function () {
      var code = fs.readFileSync(file_n, "utf-8");
      var result = jshint(code, {
        asi: false, auto_indent: true,
        debug: false, indent: 2, immed: true,
        lastsemic: false, laxbreak: true, maxerr: 9000,
        shadow: false, sub: false, supernew: false, white: true
      });
      return fixmyjs(jshint.data(), code).run();
    },

    "ok": function (topic) {
      var ok = fs.readFileSync(file_y).toString();
      assert.equal(topic, ok);
    }

  };

  specs[test] = spec;
});

vows.describe("jshint-autofix").addBatch(specs).export(module);
