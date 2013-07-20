module.exports = function (f, l, assert) {
  return {
    'adds parentheses to constructor': function () {
      var code = 'new Foo;'
      var result = 'new Foo();'
      assert.equal(f(code, {}), result)
    }
  }
}
