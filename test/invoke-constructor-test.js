module.exports = function (f, assert) {
  return {
    'constructors are invocations': function () {
      var code = 'var foo = new Foo;'
      var result = 'var foo = new Foo();'
      assert.equal(f(code, {}), result)
    },

    'constructors are invocations fixed': function () {
      var code = 'var foo = new Foo();'
      var result = 'var foo = new Foo();'
      assert.equal(f(code, {}), result)
    },

    'constructors are invocations multi': function () {
      var code = 'var foo = new Foo(1, 2, 3);'
      var result = 'var foo = new Foo(1, 2, 3);'
      assert.equal(f(code, {}), result)
    }
  }
}
