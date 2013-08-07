module.exports = function (f, assert) {
  return {
    'comments should not be removed': function () {
       var code = 'var i = 0; \n //test \n i++'
       var result = 'var i = 0; \n //test \n i += 1'
       assert.equal(f(code, {}), result)
    }
  }
}

