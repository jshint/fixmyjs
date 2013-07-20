module.exports = function (f, assert) {
  return {
    'trailing commas are removed': function () {
      var code = 'foo([1, 2, 3,]);'
      var result = 'foo([\n  1,\n  2,\n  3\n]);'
      assert.equal(f(code, { indent: 2 }), result)
    }
  }
}
