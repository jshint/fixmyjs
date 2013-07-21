module.exports = function (f, l, assert) {
  return {
    'square bracket notation is converted to dot notation': function () {
      var code = 'a["b"];'
      var result = 'a.b;'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'chained computed member expression to dot notation': function () {
      var code = 'a["b"]["c"];'
      var result = 'a.b.c;'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'computed member expression for reserved words': function () {
      var code = 'a[\'for\'];'
      assert.equal(f(code, {}), code)
      assert.equal(l(code, {}), code)
    }
  }
}
