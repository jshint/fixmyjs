module.exports = function (f, assert) {
  return {
    'adds parentheses to constructor': function () {
      var code = 'var foo = new Foo;'
      var result = 'var foo = new Foo();'
      assert.equal(f(code, {}), result)
    }
  }
}
