module.exports = function (f, l, assert) {
  var options = { nonew: true }
  return {
    'no new as side effects': function () {
      var code = 'new Foo();'
      var result = 'Foo();'
      assert.equal(f(code, options), result)
      assert.equal(l(code, options), result)
    },

    'missing parens plus side effects': function () {
      var code = 'new Foo;'
      var result = 'Foo();'
      assert.equal(f(code, options), result)
    }
  }
}
