module.exports = function (f, assert) {
  return {
    'trailing commas in arrays are removed': function () {
      var code = 'foo([1, 2, 3,]);'
      var result = 'foo([1, 2, 3]);'
      assert.equal(f(code, {}), result)
    },

    'trailing commas in objects are removed': function () {
      var code = 'foo({ a: 1, b: 2, c: 3,});'
      var result = 'foo({\n  a: 1,\n  b: 2,\n  c: 3\n});'
      assert.equal(f(code, {}), result)
    }
  }
}
