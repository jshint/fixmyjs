module.exports = function (f, assert) {
  return {
    'unnecessary semicolons are removed': function () {
      var code = 'var a = 1;;'
      var result = 'var a = 1;'
      assert.equal(f(code, {}), result)
    }
  }
}
