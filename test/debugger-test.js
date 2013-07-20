module.exports = function (f, l, assert) {
  return {
    'remove debugger statements': function () {
      var code = 'debugger;'
      assert.equal(f(code, {}), '')
      assert.equal(l(code, {}), '')
    }
  }
}
