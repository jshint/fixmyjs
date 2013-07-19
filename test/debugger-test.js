module.exports = function (f, l, assert) {
  return {
    'remove debugger statements': function () {
      var code = 'debugger;'
      assert.equal(f(code, {}), '')
    },

    'legacy removes debugger statements': function () {
      var code = 'debugger;'
      console.log(l(code, {}))
      assert.equal(l(code, {}), '')
    }
  }
}
