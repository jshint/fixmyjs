/*globals define */
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
  var esformatter = require('esformatter')
  var fu = require('fu')
  var pkg = require('../package.json')
  var recast = require('recast')
  var traverse = require('./traverse')

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
      throw new TypeError('Cannot contain both camelcase and snakecase options')
    }

    if (rules.multivar || rules.onevar) {
      if (rules.hoist) {
        throw new TypeError('Must pick one of multivar, onevar, or hoist')
      }

      if (rules.multivar && rules.onevar) {
        throw new TypeError('Cannot contain both multivar and onevar options')
      }
    }
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

  function fix(code, config) {
    config = config || {}

    var shebang = SHEBANG.exec(code)
    var pureCode = code.replace(SHEBANG, '')
    var lines = pureCode.split('\n')
    var ast
    try {
      ast = recast.parse(pureCode)
    } catch (e) {
      if (e.message === 'AST contains no nodes at all?') {
        return code
      }
      throw e
    }
    validateRules(config)
    var rules = getRules(config)
    var options = { wrapColumn: Infinity }

    var modifiedTree = traverse(ast, function (node, parent) {
      return fu.foldl(function (node, f) {
        return node && f.hasOwnProperty(node.type)
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

  return {
    fix: fix,
    version: pkg.version,
    defaultOptions: pkg.fixmyjs
  }
})
