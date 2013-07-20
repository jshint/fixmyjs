module.exports = function (f, l, assert) {
  return {
    'eq comparisons to NaN are replaced with isNaN function': function () {
      var code = 'a == NaN;'
      var result = 'isNaN(a);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'neq comparisons to NaN are replaced with isNaN function': function () {
      var code = 'a != NaN;'
      var result = '!isNaN(a);'
      assert.equal(f(code, {}), result)
      assert.equal(l(code, {}), result)
    },

    'comparisons to NaN with literals': function () {
      var code = '4 == NaN;'
      var result = 'isNaN(4);'
      assert.equal(f(code, {}), result)
    },

    'multiline NaN comparisons are fixed': function () {
      var code = [
        '(foo || bar(2))',
        '!= NaN;'
      ].join('\n')
      var result = '!isNaN(foo || bar(2));'
      assert.equal(f(code, {}), result)
    }
  }
}
