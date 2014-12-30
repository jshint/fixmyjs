module.exports = function (f, assert) {
  var options = { curly: false }
  return {
    'sole empty statements are removed': function () {
      var code = 'var a = 1;;'
      var result = 'var a = 1;'
      assert.equal(f(code, options), result)
    },

    'empty statements are removed within functions': function () {
      var code = 'function x() { var a = 1;; }'
      var result = 'function x() {\n  var a = 1;\n}'
      assert.equal(f(code, options), result)
    },

    'empty statements dont fatal the rewriter': function () {
      var code = 'for (;;);'
      var result = 'for (;;);'
      assert.equal(f(code, options), result)
    },

    'empty statements work for if': function () {
      var code = 'if (true);'
      var result = 'if (true);'
      assert.equal(f(code, options), result)
    },

    'empty statements work for while': function () {
      var code = 'while (true);'
      var result = 'while (true);'
      assert.equal(f(code, options), result)
    },

    'just an empty statement': function () {
      var code = ';;'
      var result = ';'
      assert.equal(f(code, options), result)
    }
  }
}
