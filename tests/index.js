var vows = require('vows');
var assert = require('assert');
var jshint = require('../lib/');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

var tests = fs.readdirSync(__dirname + "/fixtures/broken/");

var specs = {};

tests.forEach(function (test) {
  var file_n = __dirname + "/fixtures/broken/" + test;
  var file_y = __dirname + "/fixtures/ok/" + test;

  var spec = {};
  spec["?"] = {
    topic: function () {
      var ev = new EventEmitter();
      ev.on("done", function (io) {
        this.callback(null, io.getCode());
        io.clearCache();
      }.bind(this));

      jshint.run(["node", "vows", file_n], ev);
    },

    "ok": function (topic) {
      var ok = fs.readFileSync(file_y).toString();
      assert.equal(topic, ok);
    }

  };

  specs[test] = spec;
});

vows.describe("jshint-autofix").addBatch(specs).export(module);
