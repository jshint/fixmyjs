module.exports = function (f, assert) {
  var options = { curly: true }
  return {
    'for statements get curly braces': function () {
      var code = 'for (;;) x;'
      var result = 'for (; ; ) {\n  x;\n}'
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
    },

    'leave elseif\'s be': function () {
      var code = 'if (x) x; else if (x || y) x;'
      var result = 'if (x) {\n  x;\n} else if (x || y) {\n  x;\n}'
      assert.equal(f(code, options), result)
    },

    'nested ifs': function () {
      var code = 'if (x) if (x || y) if (z) x;'
      var result = 'if (x) {\n  if (x || y) {\n    if (z) {\n      x;\n    }\n  }\n}'
      assert.equal(f(code, options), result)
    },

    'nested else ifs': function () {
      var code = 'if (x) if (x || y) x; else if (z) x; else if(q) x; else x;'
      var result = 'if (x) {\n  if (x || y) {\n    x;\n  } else if (z) {\n    x;\n  } else if (q) {\n    x;\n  } else {\n    x;\n  }\n}'
      assert.equal(f(code, options), result)
    },

    'already has curlies': function () {
      var code = 'if (x) { x } else { x }'
      assert.equal(f(code, options), code)
    },

    'for statements get curly braces with opts curlyfor': function () {
      var code = 'for (;;) x;'
      var result = 'for (; ; ) {\n  x;\n}'
      assert.equal(f(code, { curly: false, curlyfor: true }), result)
    },

    'while statements get curly braces with opts curlywhile': function () {
      var code = 'while (true) x;'
      var result = 'while (true) {\n  x;\n}'
      assert.equal(f(code, { curly: false, curlywhile: true }), result)
    },

    'if statements get curly braces with opts curlyif': function () {
      var code = 'if (x) x; else x;'
      var result = 'if (x) {\n  x;\n} else {\n  x;\n}'
      assert.equal(f(code, { curly: false, curlyif: true }), result)
    },

    'while and if left alone for curlyfor': function () {
      var code;

      code = 'while (true) x;'
      assert.equal(f(code, { curly: false, curlyfor: true }), code)

      code = 'if (x) x; else x;'
      assert.equal(f(code, { curly: false, curlyfor: true }), code)
    },

    'for and if left alone for curlywhile': function () {
      var code;

      code = 'for (;;) x;'
      assert.equal(f(code, { curly: false, curlywhile: true }), code)

      code = 'if (x) x; else x;'
      assert.equal(f(code, { curly: false, curlywhile: true }), code)
    },

    'all left alone when curly is false': function () {
      var code;

      code = 'if (x) x; else x;'
      assert.equal(f(code, { curly: false }), code)

      code = 'for (;;) x;'
      assert.equal(f(code, { curly: false }), code)

      code = 'while (true) x;'
      assert.equal(f(code, { curly: false }), code)
    }
  }
}
