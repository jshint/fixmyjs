module.exports = function (f, l, assert) {
  return {
    'convert Object calls to literals': function () {
      var code = 'var a = Object();'
      assert.equal(f(code, {}), 'var a = {};')
    },

    'do not convert Object calls with an argument': function () {
      var code = 'var a = Object(null);'
      assert.equal(f(code, {}), 'var a = Object(null);')
    },

    'convert Object constructions': function () {
      var code = 'var a = new Object();'
      assert.equal(f(code, {}), 'var a = {};')
    },

    'do not convert Object constructions with an argument': function () {
      var code = 'var a = new Object(null);'
      assert.equal(f(code, {}), 'var a = new Object(null);')
    },

    'legacy Object literal': function () {
      var code = 'var foo = new Object();'
      assert.equal(l(code, {}), 'var foo = {};')
    },

    'legacy Ojbect literal multiple statements': function () {
      var code = 'var foo = new Object(); var bar = new Object();'
      assert.equal(l(code, {}), 'var foo = {}; var bar = {};')
    }
  }
}
