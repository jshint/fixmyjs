module.exports = function (f, l, assert) {
  return {
    'convert Array calls to literals': function () {
      var code = 'var a = Array();'
      assert.equal(f(code, {}), 'var a = [];')
    },

    'do not convert Array calls with an argument': function () {
      var code = 'var a = Array(5);'
      assert.equal(f(code, {}), 'var a = Array(5);')
    },

    'convert Array constructions': function () {
      var code = 'var a = new Array();'
      assert.equal(f(code, {}), 'var a = [];')
    },

    'do not convert Array constructions with an argument': function () {
      var code = 'var a = new Array(3);'
      assert.equal(f(code, {}), 'var a = new Array(3);')
    },

    'legacy Array literal': function () {
      var code = 'var foo = new Array();'
      assert.equal(l(code, {}), 'var foo = [];')
    },

    'legacy Array literal multiple statements': function () {
      var code = 'var foo = new Array(); var bar = new Array();'
      assert.equal(l(code, {}), 'var foo = []; var bar = [];')
    }
  }
}
