module.exports = function (f, assert) {
  return {
    'remove debugger statements': function () {
      var code = 'debugger;'
      assert.equal(f(code, {}), ';')
    }
  }
}
