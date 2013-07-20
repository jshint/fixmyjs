module.exports = function (f, l, assert) {
  return {
    'plusplus is changed to += 1': function () {
      var code = 'a++;'
      var result = 'a += 1;'
      assert.equal(f(code, {}), result)
    },

    'minusminus is changed to -= 1': function () {
      var code = 'a--;'
      var result = 'a -= 1;'
      assert.equal(f(code, {}), result)
    }
  }
}
