module.exports = function (f, assert) {
  var options = { camelcase: true }
  return {
    'snake_case is converted to camelCase': function () {
      var code = 'snake_case;'
      var result = 'snakeCase;'
      assert.equal(f(code, options), result)
    },

    'leading and trailing underscores are not converted': function () {
      var code = '_private;'
      assert.equal(f(code, options), code)

      code = '__wtf;'
      assert.equal(f(code, options), code)

      code = 'yeah_;'
      assert.equal(f(code, options), code)

      code = 'triple___;'
      assert.equal(f(code, options), code)

      code = 'double__isGoodToo;'
      assert.equal(f(code, options), code)
    },

    'properties are not converted': function () {
      var code = 'var a = { snake_case: 1 };'
      assert.equal(f(code, options), code)
    },

    'member expressions are not converted': function () {
      var code = 'a.foo_bar();'
      assert.equal(f(code, options), code)
    },

    'camelCase is not converted': function () {
      var code = 'camelCase;'
      assert.equal(f(code, options), code)
    }
  }
}
