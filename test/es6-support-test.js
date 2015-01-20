module.exports = function (f, assert) {
  return {
    'classes are supported': function () {
      var code = 'class Foo { hello() { var a = undefined; } }'
      var result = 'class Foo { hello() { var a; } }'

      assert.equal(f(code), result)
    }
  }
}
