module.exports = function (f, assert) {
  return {
    'remove shebang from code': function () {
      var code = [
        '#!/usr/bin/env node',
        'module.exports = 2;'
      ].join('\n')
      assert.equal(f(code, {}), code)
    }
  }
}
