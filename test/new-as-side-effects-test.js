module.exports = function (f, assert) {
  var options = { nonew: true }
  return {
    'no new as side effects': function () {
      var code = 'new Foo();'
      var result = 'Foo();'
      assert.equal(f(code, options), result)
    },

    'missing parens plus side effects': function () {
      var code = 'new Foo;'
      var result = 'Foo();'
      assert.equal(f(code, options), result)
    },

    'new as function parameter': function () {
      var code = 'c(new Foo());'
      var result = 'c(new Foo());'
      assert.equal(f(code, options), result)
    },

    'new as function parameter without parens': function () {
      var code = 'c(new Foo);'
      var result = 'c(new Foo());'
      assert.equal(f(code, options), result)
    }
  }
}
