module.exports = function (f, l, assert) {
  var options = { multivar: true }
  return {
    'should not split var declarations in loops': function () {
      var code = 'for (var i = 0, k = 1;;) {\n}'
      var real = f(code, options)
      assert.equal(real, code)
    }
  }
}
