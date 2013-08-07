module.exports = function (f, l, assert) {
  return {
    'dont remove comments': function () {
      var code = 'var i = 0;\n//test\ni++;'
      var result = 'var i = 0;\n//test\ni++;'
      var real = f(code, {});
      assert.equal(real, result)
    }
  }
}
