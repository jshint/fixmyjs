module.exports = function (f, assert) {
  return {
    'do not delete Identifiers': function () {
      var code = 'delete f;'
      var result = 'f = undefined;'
      assert.equal(f(code, {}), result)
    },

    'do not fix delete for MemberExpression': function () {
      var code = 'delete f.u;'
      assert.equal(f(code, {}), code)
    },

    'unary expressions are not affected': function () {
      var code = 'typeof foo'
      assert.equal(f(code, {}), code)
    }
  }
}
