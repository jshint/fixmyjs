module.exports = function (f, assert) {
  var options = { curly: true }
  return {
    'for statements get curly braces': function () {
      var code = 'for (;;) x;'
      var result = 'for (;;) {\n  x;\n}'
      assert.equal(f(code, options), result)
    },

    'while statements with curly braces are left alone': function () {
      var code = 'while (true) {\n  x;\n}'
      assert.equal(f(code, options), code)
    },

    'while statements get curlies': function () {
      var code = 'while (true) x;'
      var result = 'while (true) {\n  x;\n}'
      assert.equal(f(code, options), result)
    },

    'if statements get curly braces': function () {
      var code = 'if (x) x; else x;'
      var result = 'if (x) {\n  x;\n} else {\n  x;\n}'
      assert.equal(f(code, options), result)
    },

    'if statements with no alternate get curlies': function () {
      var code = 'if (x) x;'
      var result = 'if (x) {\n  x;\n}'
      assert.equal(f(code, options), result)
    }
  }
}
