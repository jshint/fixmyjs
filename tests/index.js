var vows = require('vows');
var assert = require('assert');
var jshint = require('../packages/jshint/jshint').JSHINT;
var jsdiff = require('./jsdiff');
var fs = require('fs');

// An Array of tests to run.
var tests;

// The specs object.
var specs = {};

// These are the options fixmyjs supports.
var options = {
  asi: false, auto_indent: false,
  debug: false, indent: 2,
  indentpref: "spaces", immed: true,
  lastsemic: false, laxbreak: true,
  maxerr: 500, nonew: true, shadow: false, sub: false,
  supernew: false, trailing: true, white: true
};

// DSL for running a string against JSHint and passing off results
// to fixmyjs. Returns an Object.
var DSL = function (code, opts) {
  code = code || "var foo = 1";
  opts = opts || options;
  var result = jshint(code, opts);
  return fixmyjs(jshint.data(), code);
};

// Allows single tests to be ran.
// Otherwise it reads the directory `fixtures/broken` for all tests.
if (process.argv[1].indexOf("vows") === -1 && process.argv[2]) {
  tests = [process.argv[2]];
} else {
  tests = fs.readdirSync(__dirname + "/fixtures/broken/");
}

// Determines whether we use the instrumented version
// of fixmyjs or the regular version.
var fixmyjs = require((process.argv[3] && process.argv[3].indexOf("--cover") !== -1) ? '../jscoverage/fixmyjs' : '../fixmyjs');


// Loop through each test and add a topic. Prepare for vows.
tests.forEach(function (test) {
  var file_n = __dirname + "/fixtures/broken/" + test;
  var file_y = __dirname + "/fixtures/ok/" + test;

  var opts = options;

  // special case tests where options need to be different.
  if (test === "autoindentspaces.js") {
    opts = { white: true, indent: 2, indentpref: "spaces", auto_indent: true };
  } else if (test === "autoindenttabs.js") {
    opts = { white: true, indent: 2, indentpref: "tabs", auto_indent: true };
  }
  // \

  // Adds the spec.
  var spec = {};
  spec["?"] = {
    topic: function () {
      return DSL(fs.readFileSync(file_n, "utf-8"), opts).run();
    },

    "ok": function (topic) {
      var ok = fs.readFileSync(file_y).toString();
      var err = null;
      try {
        assert.equal(topic, ok);
      } catch (e) {
        console.log(jsdiff.diffString(e.expected, e.actual));
        err = e;
      }

      if (err) {
        throw err;
      }
    }

  };

  // Adds individual spec into group of specs.
  specs[test] = spec;
});

if (tests.length > 1) {
  specs.api = {
    "when too many errors are encountered": {
      topic: function () {
        return DSL(fs.readFileSync(__dirname + "/fixtures/toomanyerrors.js", "utf-8")).run;
      },

      "an error is thrown": function (topic) {
        assert.throws(topic, Error);
      }
    },

    // Testing for the API of fixmyjs.
    "getErrors() when retrieving all errors": {
      topic: function () {
        return DSL().getErrors();
      },

      "we get an Array of all the errors": function (topic) {
        assert.isArray(topic);
        assert.equal(topic.length, 1);
      }
    },

    "getCode() when retrieving the code": {
      topic: function () {
        return DSL().getCode();
      },

      "we get the code as a String": function (topic) {
        assert.isString(topic);
        assert.equal(topic, "var foo = 1");
      }
    },

    "getConfig() when retrieving the config": {
      topic: function () {
        return DSL().getConfig();
      },

      "we get the config as an Object": function (topic) {
        assert.isObject(topic);
        assert.isFalse(topic.asi);
        assert.isTrue(topic.immed);
      }
    },

    "next() when using next to iterate through the errors": {
      topic: function () {
        var result;
        try {
          result = DSL().next();
        } catch (e) {
          result = e;
        }
        return result;
      },

      "we expect the next item to be an Object": function (topic) {
        assert.isObject(topic);
        assert.isFunction(topic.fix);
        assert.isFunction(topic.getDetails);
      }
    },

    "next().getDetails() when retrieving an item's details": {
      topic: function () {
        return DSL().next().getDetails();
      },

      "we expect the results from JSHint": function (topic) {
        assert.isObject(topic);
        assert.equal(topic.reason, "Missing semicolon.");
      }
    },

    "next().fix() when fixing an item": {
      topic: function () {
        return DSL().next().fix();
      },

      "we expect the String to return fixed": function (topic) {
        assert.isString(topic);
        assert.equal(topic, "var foo = 1;");
      }
    },

    "next().next() when getting to the end of the list.": {
      topic: function () {
        return DSL();
      },

      "we expect an error to be thrown": function (topic) {
        topic.next();
        assert.throws(topic.next, Error);
      }
    }
  };
}

// Export to vows.
vows.describe("jshint-autofix").addBatch(specs).export(module);
