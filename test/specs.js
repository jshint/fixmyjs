/*global fixMyJS: true */
var vows = require('vows');
var assert = require('assert');
var jshint = require('../packages/jshint/jshint').JSHINT;
var jsdiff = require('./lib/jsdiff');
var fs = require('fs');

if (typeof fixMyJS === 'undefined') {
  fixMyJS = require('../fixmyjs');
}

var Test = function Test() {
  this.specs = {};
};


// DSL for running a string against JSHint and passing off results
// to fixmyjs. Returns an Object.
function DSL(code, opts) {
  code = code || "var foo = 1";
  opts = opts || Test.options;
  var result = jshint(code, opts);
  return fixMyJS(jshint.data(), code);
}


// These are the options fixmyjs supports.
Test.options = {
  asi: false,
  auto_indent: false,
  debug: false,
  indent: 2,
  indentpref: "spaces",
  immed: true,
  lastsemic: false,
  laxbreak: true,
  maxerr: 500,
  nonew: true,
  shadow: false,
  sub: false,
  supernew: false,
  trailing: true,
  white: true
};

Test.prototype.addTest = function (test) {
  var file_n = __dirname + "/fixtures/broken/" + test;
  var file_y = __dirname + "/fixtures/ok/" + test;

  var opts = Test.options;

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
  this.specs[test] = spec;
};


// Allows single tests to be ran.
// Otherwise it reads the directory `fixtures/broken` for all tests.
//
// returns this.specs
Test.prototype.addFiles = function (files) {
  if (typeof files === 'undefined') {
    files = fs.readdirSync(__dirname + '/fixtures/broken/');
  }

  if (!Array.isArray(files)) {
    files = [files];
  }

  // Loop through each test and add a topic. Prepare for vows.
  files.forEach(this.addTest.bind(this));

  return this.specs;
};

// Adds API related tests to the runner
// is only called if we're running all unit tests
Test.prototype.addTests = function () {
  this.specs.api = {
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

    "hasNext() when testing if there is a next": {
      topic: function () {
        return DSL().hasNext();
      },

      "we get true since there is a next object": function (topic) {
        assert.isTrue(topic);
      }
    },

    "hasNext() when testing if there is a next item": {
      topic: function () {
        return DSL();
      },

      "we get false since there is not a next object": function (topic) {
        topic.next();
        assert.isFalse(topic.hasNext());
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
};

// Export to vows.
module.exports = {
  run: function (fn, cb) {
    var test = this.test;
    test.addFiles();
    test.addTests();

    fixMyJS = fn;

    vows.describe('fixmyjs').addBatch(test.specs).run({}, cb);
  },

  test: new Test()
};
