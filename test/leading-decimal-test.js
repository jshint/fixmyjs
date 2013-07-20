module.exports = function (f, l, assert) {
  return {
    'fix for leading decimals': function () {
      var code = 'var a = .25;'
      var result = 'var a = 0.25;'
      assert.equal(f(code, {}), result)
    },

    'leading decimals on member expressions': function () {
      var code = 'Foo.bar = .25;'
      var result = 'Foo.bar = 0.25;'
      assert.equal(f(code, {}), result)
    },

    'legacy does not fix leading decimals': function () {
      var code = 'var a = .25;'
      var result = 'var a = .25;'
      assert.equal(l(code, {}), result)
    }
  }
}
