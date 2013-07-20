module.exports = function (f, l, assert) {
  return {
    'removes var initialization to undefined': function () {
      var code = 'var a = undefined;'
      var result = 'var a;'
      assert.equal(f(code, {}), result)
      console.log(l(code, {}))
      assert.equal(l(code, {}), result)
    }
  }
}
