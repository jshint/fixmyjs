module.exports = function (f, assert) {
  var options = { eqeqeq: true }
  return {
    '== is converted to ===': function () {
      var code = 'a == null;'
      var result = 'a === null;'
      assert.equal(f(code, options), result)
    },

    '!= is converted to !==': function () {
      var code = '1 != 2;'
      var result = '1 !== 2;'
      assert.equal(f(code, options), result)
    },

    '=== is not converted': function () {
      var code = 'g === undefined;'
      assert.equal(f(code, options), code)
    },

    '> is not converted': function () {
      var code = '4 > 3;'
      assert.equal(f(code, options), code)
    }
  }
}
