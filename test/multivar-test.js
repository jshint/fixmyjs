module.exports = function (f, assert) {
  var options = { multivar: true }
  return {
    'splits multivar declarations into multiple statements': function () {
      var code = 'var a, b;'
      var result = 'var a;\nvar b;'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'should not split var declarations in loops': function () {
      var code = 'for (var i = 0, k = 1;;) {\n}'
      var real = f(code, options)
      assert.equal(real, code)
    }
  }
}
