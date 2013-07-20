module.exports = function (f, l, assert) {
  return {
    'semicolons are automatically inserted': function () {
      var code = 'var f'
      var result = 'var f;'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    }
  }
}
