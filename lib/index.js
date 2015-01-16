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

  var esprima = require('esprima')
  var escodegen = require('escodegen')
  var fu = require('fu')
  var rules = require('./rules')

  var SHEBANG = /^\#\!.*/

  var ESPRIMA_OPTIONS = {
    range: true,
    tokens: true,
    comment: true
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

  function createIndent(n, indent) {
    return Array(Number(n) + 1).join(indent == 'spaces' ? ' ' : '\t')
  }

  function genHas(obj) {
    return function (key, fallback) {
      return obj.hasOwnProperty(key) && obj[key] !== undefined
        ? obj[key]
        : fallback
    }
  }

  fixMyJS.fix = function (code, config) {
    validateRules(config)

    var shebang = SHEBANG.exec(code)
    var ast = esprima.parse(code.replace(SHEBANG, ''), ESPRIMA_OPTIONS)
    var astWithComments = escodegen.attachComments(
      ast, ast.comments, ast.tokens)
    var has = genHas(config)
    var rules = getRules(has)
    var options = {
      format: {
        indent: {
          style: createIndent(has('indent', 2), has('indentpref', 'spaces')),
          base: 0
        },
        json: false,
        renumber: false,
        quotes: has('quotmark', 'single'),
        escapeless: has('escapeless', false),
        parentheses: true,
        semicolons: !has('asi', false)
      },
      parse: null,
      comment: true
    }
    var modifiedTree = traverse(astWithComments, function (node, parent) {
      return fu.foldl(function (node, f) {
        return f.hasOwnProperty(node.type)
          ? f[node.type](node, parent)
          : node
      }, rules, node)
    })
    var generatedCode = escodegen.generate(modifiedTree, options)

    return shebang === null
      ? generatedCode
      : [shebang[0], generatedCode].join('\n')
  }

  fixMyJS.version = require('../package.json').version

  return fixMyJS
})
