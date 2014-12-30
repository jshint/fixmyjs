module.exports = function (f, assert) {
  return {
    'both accept dogballs': function () {
      var code = '(function () { })();'
      assert.equal(f(code, {}), code)
    }
  }
}
