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
      assert.equal(f(code, options), code)
    },

    'snake_case is not converted': function () {
      var code = 'snake_case;'
      assert.equal(f(code, options), code)
    }
  }
}
