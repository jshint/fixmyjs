module.exports = function (f, assert) {
  return {
    'cant contain both camelcase and snakecase': function () {
      assert.throws(function () {
        f('var f', {
          camelcase: true,
          snakecase: true
        })
      }, Error)
    }
  }
}
