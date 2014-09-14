module.exports = function (f, l, assert) {
  return {
    'Number constructions': function () {
      var code = 'var a = new Number(3);'
      var result = 'var a = Number(3);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'String constructions': function () {
      var code = 'var a = new String("foo");'
      var result = 'var a = String("foo");'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'JSON constructions': function () {
      var code = 'var a = new JSON({});'
      var result = 'var a = JSON({});'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'Math constructions': function () {
      var code = 'var a = new Math(2 + 2);'
      var result = 'var a = Math(2 + 2);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'Boolean constructions': function () {
      var code = 'var d = c(new Boolean(false));'
      var result = 'var d = c(Boolean(false));'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    }
  }
}
