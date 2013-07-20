module.exports = function (f, l, assert) {
  return {
    'parseInt gets the radix': function () {
      var code = 'parseInt(23820);'
      var result = 'parseInt(23820, 10);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'parseInt works regardless of parentheses nesting': function () {
      var code = 'parseInt(someFunction(1));'
      var result = 'parseInt(someFunction(1), 10);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), code)
    }
  }
}
