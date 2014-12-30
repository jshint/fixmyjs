module.exports = function (f, assert) {
  return {
    'fix for trailing decimals': function () {
      var code = 'var a = 2.;'
      var result = 'var a = 2;'
      assert.equal(f(code, {}), result)
    }
  }
}
