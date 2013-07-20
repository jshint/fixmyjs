module.exports = function (f, l, assert) {
  return {
    'unnecessary semicolons are removed': function () {
      var code = 'var a = 1;;'
      var result = 'var a = 1;'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    }
  }
}
