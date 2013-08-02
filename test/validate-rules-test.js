module.exports = function (f, assert) {
  return {
    'cant contain both camelCase and snake_case': function () {
      assert.throws(function () {
        f('var f', {
          camelcase: true,
          snakecase: true
        })
      }, Error)
    },

    'invalid type for quotmark': function () {
      assert.throws(function () {
        f('', { quotmark: 'triple' })
      }, Error)
    },

    'invalid type for indentpref': function () {
      assert.throws(function () {
        f('', { indentpref: 'mixed' })
      }, Error)
    }
  }
}
