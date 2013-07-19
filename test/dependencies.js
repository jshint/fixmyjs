var fixmyjs = require('../')
var jshint = require('jshint').JSHINT

module.exports = {
  f: fixmyjs.fix,
  l: function (code, options) {
    jshint(code, options)
    return fixmyjs(jshint.data(), code, options).run()
  }
}
