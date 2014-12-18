module.exports = function (f, l, assert) {
  var options = { multivar: true }
  return {
    'splits multivar declarations into multiple statements': function () {
      var code = 'var a, b;'
      var result = 'var a;\nvar b;'
      var real = f(code, options)
      assert.equal(real, result)
    }
  }
}
