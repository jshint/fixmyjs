module.exports = function (f, l, assert) {
  var options = { plusplus: true }

  return {
    'plusplus is changed to += 1': function () {
      var code = 'a++;'
      var result = 'a += 1;'
      assert.equal(f(code, options), result)
    },

    'minusminus is changed to -= 1': function () {
      var code = 'a--;'
      var result = 'a -= 1;'
      assert.equal(f(code, options), result)
    }
  }
}
