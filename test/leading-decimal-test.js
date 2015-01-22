module.exports = function (f, assert) {
  var opts = { decimals: true }
  return {
    'fix for leading decimals': function () {
      var code = 'var a = .25;'
      var result = 'var a = 0.25;'
      assert.equal(f(code, opts), result)
    },

    'leading decimals on member expressions': function () {
      var code = 'Foo.bar = .25;'
      var result = 'Foo.bar = 0.25;'
      assert.equal(f(code, opts), result)
    },

    'normal numbers': function () {
      var code = 'var bar = 25;'
      assert.equal(f(code, opts), code)
    }
  }
}
