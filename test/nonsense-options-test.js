module.exports = function (f, assert) {
  var options = { woiefjoewifowiefjoiwefoewfw: true }
  return {
    'non existent options do not affect program': function () {
      var code = 'var a;'
      assert.equal(f(code, options), code)
    }
  }
}
