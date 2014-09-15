module.exports = function (f, l, assert) {
  return {
    'constructors are invocations': function () {
      var code = 'var foo = new Foo;'
      var result = 'var foo = new Foo();'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'constructors are invocations fixed': function () {
      var code = 'var foo = new Foo();'
      var result = 'var foo = new Foo();'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'constructors are invocations multi': function () {
      var code = 'var foo = new Foo(1, 2, 3);'
      var result = 'var foo = new Foo(1, 2, 3);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'constructors have invocation multiple statements': function () {
      var code = 'var foo = new Foo; var baz = new Baz(); var bar = new Bar;'
      assert.equal(l(code, {}), 'var foo = new Foo(); var baz = new Baz(); ' +
                   'var bar = new Bar();')
    },
  }
}
