module.exports = function (f, assert) {
  return {
    'cant contain both camelCase and snake_case': function () {
      assert.throws(function () {
        f('var f', {
          camelcase: true,
          snakecase: true
        })
      }, Error)
    }
  }
}
