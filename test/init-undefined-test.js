module.exports = function (f, assert) {
  return {
    'removes var initialization to undefined': function () {
      var code = 'var a = undefined;'
      var result = 'var a;'
      assert.equal(f(code, {}), result)
    }
  }
}
