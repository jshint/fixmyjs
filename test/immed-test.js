module.exports = function (f, l, assert) {
  return {
    'both accept dogballs': function () {
      var code = '(function () { })();'
      var result = '(function () {})();'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), code)
    }
  }
}
