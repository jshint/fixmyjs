/*globals define, toString */
;(function (name, definition) {
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
  var fixMyJS = require('./legacy')

  var esformatter = require('esformatter')
  var recast = require('recast')
  var fu = require('fu')
  var rules = require('./rules')

  var SHEBANG = /^(\#\!.*)\n/

  var validRules = {
    indentpref: ['spaces', 'tabs'],
    quotmark: ['single', 'double']
  }

  function getRules(has) {
    var getRule = function (x) { return x[1] }
    var falseRule = function (x) { return has(x[0], false) }
    var trueRule = fu.comp(fu.not, falseRule)
    return fu.concat(
      rules.builtin,
      fu.map(getRule, fu.filter(falseRule, fu.intoArray(rules.aretrue))),
      fu.map(getRule, fu.filter(trueRule, fu.intoArray(rules.arefalse)))
    )
  }

  function validateRules(rules) {
    if (rules.camelcase && rules.snakecase) {
      throw new Error('Cannot contain both camelcase and snakecase options')
    }

    fu.map(fu.apply(function (ruleName, possibleValues) {
      if (rules.hasOwnProperty(ruleName) &&
          !fu.elem(rules[ruleName], possibleValues)) {
        throw new Error('Invalid type for ' + ruleName)
      }
    }), fu.intoArray(validRules))

    return rules
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

  function genHas(obj) {
    return function (key, fallback) {
      return obj.hasOwnProperty(key) && obj[key] !== undefined
        ? obj[key]
        : fallback
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

  fixMyJS.fix = function (code, config) {
    var shebang = SHEBANG.exec(code)
    var pureCode = code.replace(SHEBANG, '')
    var lines = pureCode.split('\n')
    var ast = recast.parse(pureCode)
    var has = genHas(validateRules(config))
    var rules = getRules(has)
    var options = {
      tabWidth: has('indent', 2),
      useTabs: has('indentpref', 'spaces') === 'tabs',
      wrapColumn: Infinity
      // TODO
      // semicolons
      // quotes
      // formatting for arrays, objects, etc...
    }
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

  fixMyJS.version = require('../package.json').version

  return fixMyJS
})
