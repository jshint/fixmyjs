module.exports = function (f, assert) {
  return {
    'an empty program is ok': function () {
      var code = ''
      assert.equal(f(code, {}), '')
    },

    'a program of comments does not throw': function () {
      var code = '/* lol */'
      assert.equal(f(code, {}), code)
    }
  }
}
