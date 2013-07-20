module.exports = function (f, l, assert) {
  return {
    'dogballs are placed inside the parentheses': function () {
      var code ='(function () { })();'
      var result = '(function () {\n}());'
      assert.equal(f(code, {}), result)
    },

    'legacy accepts dogballs': function () {
      var code ='(function () { })();'
      assert.equal(l(code, {}), code)
    }
  }
}
