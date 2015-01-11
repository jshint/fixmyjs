/*globals define, toString */
/* istanbul ignore next */
(function (name, definition) {
  'use strict';
  if (typeof define == 'function') {
    define(definition)
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = definition()
  } else {
    var Module = definition(), global = this, old = global[name]
    Module.noConflict = function () {
      global[name] = old
      return Module
    }
    global[name] = Module
  }
}).call(this, 'fixMyJS', function () {
  var fixMyJS = {}

  var esformatter = require('esformatter')
  var fu = require('fu')
  var pkg = require('../package.json')
  var recast = require('recast')

  Object.assign = Object.assign || require('object-assign')

  var SHEBANG = /^(\#\!.*)\n/

  function getRules(overrides) {
    var options = Object.assign({}, pkg.fixmyjs, overrides)
    return require('./rules').map(function (rule) {
      return rule(options)
    })
  }

  function validateRules(rules) {
    if (rules.camelcase && rules.snakecase) {
      throw new Error('Cannot contain both camelcase and snakecase options')
    }
  }

  function traverse(o, f, p) {
    var k
    var self = function (x) { return traverse(x, f, p) }
    for (k in o) {
      if (toString.call(o[k]) == '[object Object]') {
        o[k] = traverse(o[k], f, o)
      } else if (Array.isArray(o[k])) {
        o[k] = fu.concatMap(self, o[k])
      }
    }
    return f(o, p)
  }

  function retrieveCode(lines, loc) {
    if (!loc) {
      return null
    }

    if (loc.start.line === loc.end.line) {
      return lines[loc.start.line - 1]
        .substring(loc.start.column, loc.end.column)
    } else {
      return fu.map(function (lineNo) {
        if (lineNo === loc.start.line - 1) {
          return lines[lineNo].slice(loc.start.column)
        } else if (lineNo === loc.end.line - 1) {
          return lines[lineNo].slice(0, loc.end.column)
        } else {
          return lines[lineNo]
        }
      }, fu.range(loc.start.line - 1, loc.end.line - 1)).join('\n')
    }
  }

  fixMyJS.fix = function (code, config) {
    config = config || {}

    var shebang = SHEBANG.exec(code)
    var pureCode = code.replace(SHEBANG, '')
    var lines = pureCode.split('\n')
    var ast = recast.parse(pureCode)
    validateRules(config)
    var rules = getRules(config)
    var options = { wrapColumn: Infinity }

    var modifiedTree = traverse(ast, function (node, parent) {
      return fu.foldl(function (node, f) {
        return f.hasOwnProperty(node.type)
          ? f[node.type](node, parent, retrieveCode(lines, node.loc))
          : node
      }, rules, node)
    })
    var generatedCode = recast.print(modifiedTree, options).code

    if (config.esformatter) {
      generatedCode = esformatter.format(generatedCode, config.esformatter)
    }

    return shebang === null
      ? generatedCode
      : [shebang[1], generatedCode].join('\n')
  }

  fixMyJS.version = pkg.version
  fixMyJS.defaultOptions = pkg.fixmyjs

  return fixMyJS
})
