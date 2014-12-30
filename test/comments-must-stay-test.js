module.exports = function (f, assert) {
  return {
    'dont remove comments': function () {
      var code = 'var i = 0;\n//test\ni += 1;'
      var result = 'var i = 0;\n//test\ni += 1;'
      var real = f(code, {});
      assert.equal(real, result)
    }
  }
}
