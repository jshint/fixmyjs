module.exports = function (f, assert) {
  var options = { snakecase: true }
  return {
    'camelCase is converted to snake_case': function () {
      var code = 'snakeCase;'
      var result = 'snake_case;'
      assert.equal(f(code, options), result)
    },

    'properties are not converted': function () {
      var code = 'var a = { camelCase: 1 };'
      var result = 'var a = {\n  camelCase: 1\n};'
      assert.equal(f(code, options), result)
    },

    'member expressions are not converted': function () {
      var code = 'a.fooBar();'
      assert.equal(f(code, options), code)
    },

    'snake_case is not converted': function () {
      var code = 'snake_case;'
      assert.equal(f(code, options), code)
    }
  }
}
