module.exports = function (f, l, assert) {
  return {
    'do not delete Identifiers': function () {
      var code = 'delete f;'
      var result = 'f = undefined;'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'do not fix delete for MemberExpression': function () {
      var code = 'delete f.u;'
      assert.equal(f(code, {}), code)
      assert.equal(l(code, {}), code)
    }
  }
}
