module.exports = function (l, assert) {
  return {
    'semicolons are automatically inserted': function () {
      var code = 'var f'
      var result = 'var f;'
      assert.equal(l(code, {}), result)
    }
  }
}
