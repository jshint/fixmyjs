module.exports = function (f, l, assert) {
  return {
    'fix for trailing decimals': function () {
      var code = 'var a = 2.;'
      var result = 'var a = 2;'
      assert.equal(f(code, {}), result)
    },

    'legacy does not fix leading decimals': function () {
      var code = 'var a = 2.;'
      var result = 'var a = 2.;'
      assert.equal(l(code, {}), result)
    }
  }
}
