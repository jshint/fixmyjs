var assert = require('assert');
var fs = require('fs');
var jshint = require('../packages/jshint/jshint').JSHINT;
var coverage = require('coveraje').coveraje;
var useServer = (process.argv[2] === 'server');

var tests = [];

var options = {
  asi: false, auto_indent: false,
  debug: false, indent: 2,
  indentpref: "spaces", immed: true,
  lastsemic: false, laxbreak: true,
  maxerr: 500, nonew: true, shadow: false, sub: false,
  supernew: false, trailing: true, white: true
};


function DSL(self, code, opts) {
  code = code || "var foo = 1";
  opts = opts || options;
  var result = jshint(code, opts);
  return self.fixMyJS(jshint.data(), code);
}

// Loop through each test and add a topic. Prepare for coveraje.
fs.readdirSync(__dirname + "/fixtures/broken/").forEach(function (test) {
  var opts;

  var file_n = __dirname + "/fixtures/broken/" + test;
  var file_y = __dirname + "/fixtures/ok/" + test;

  if (test === "autoindentspaces.js") {
    opts = { white: true, indent: 2, indentpref: "spaces", auto_indent: true };
  } else if (test === "autoindenttabs.js") {
    opts = { white: true, indent: 2, indentpref: "tabs", auto_indent: true };
  }

  var code = fs.readFileSync(file_n, 'utf-8');
  var ok = fs.readFileSync(file_y, 'utf-8');

  tests.push(function (self) {
    var result = DSL(self, code, opts).run();
    try {
      assert.equal(result, ok);
    } catch (err) {
      console.log(test, 'failed.');
    }
  });
});

// API tests
tests.push(function (self) {
  var result = DSL(self, fs.readFileSync(__dirname + '/fixtures/toomanyerrors.js', 'utf-8'));
  try {
    result.run();
  } catch (err) {
    assert.equal(err.message, 'Too many errors reported by JSHint.');
  }
});

tests.push(function (self) {
  var topic = DSL(self).getErrors();

  assert.equal(Array.isArray(topic), true);
  assert.equal(topic.length, 1);
});

tests.push(function (self) {
  var topic = DSL(self).getCode();

  assert.equal(typeof topic, 'string');
  assert.equal(topic, 'var foo = 1');
});

tests.push(function (self) {
  var topic = DSL(self).getConfig();

  assert.equal(typeof topic, 'object');
  assert.equal(topic.asi, false);
  assert.equal(topic.immed, true);
});

tests.push(function (self) {
  var topic = DSL(self).hasNext();

  assert.equal(topic, true);
});

tests.push(function (self) {
  var topic = DSL(self);
  topic.next();

  assert.equal(topic.hasNext(), false);
});

tests.push(function (self) {
  var topic = DSL(self).next();

  assert.equal(typeof topic, 'object');
  assert.equal(typeof topic.fix, 'function');
  assert.equal(typeof topic.getDetails, 'function');
});

tests.push(function (self) {
  var topic = DSL(self).next().getDetails();

  assert.equal(typeof topic, 'object');
  assert.equal(topic.reason, 'Missing semicolon.');
});

tests.push(function (self) {
  var topic = DSL(self).next().fix();

  assert.equal(typeof topic, 'string');
  assert.equal(topic, 'var foo = 1;');
});

tests.push(function (self) {
  var topic = DSL(self);

  try {
    topic.next();
    topic.next();
  } catch (err) {
    assert.equal(err.message, 'End of list.');
  }
});




// Use coveraje.
coverage.cover(fs.readFileSync(__dirname + '/../fixmyjs.js', 'utf-8'), function (self) {
  tests.forEach(function (test) {
    test(self);
  });
}, { useServer: useServer }, function () { console.log('Done'); });
