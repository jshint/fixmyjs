module.exports = function (f, assert) {
  return {
    'trailing commas are removed': function () {
      var code = 'foo([1, 2, 3,]);'
      var result = 'foo([1, 2, 3]);'
      assert.equal(f(code, {}), result)
    }
  }
}
