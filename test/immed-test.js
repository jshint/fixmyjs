module.exports = function (f, l, assert) {
  return {
    'both accept dogballs': function () {
      var code = '(function () { })();'
      assert.equal(f(code, {}), code)
      assert.equal(l(code, {}), code)
    }
  }
}
