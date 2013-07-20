module.exports = fixMyJS = require('./legacy')

var esprima = require('esprima')
var escodegen = require('escodegen')
var fu = require('fu')

var RULES = {
  builtin: [
    require('./rules/delete'),
    require('./rules/dotNotation'),
    require('./rules/emptyStatement'),
    require('./rules/initUndefined'),
    require('./rules/invalidConstructor'),
    require('./rules/isNaN'),
    require('./rules/parseInt'),
    require('./rules/useLiteral')
  ],
  aretrue: {
    curly: require('./rules/curly'),
    plusplus: require('./rules/updateExpression'),
    nonew: require('./rules/newSideEffects'),
    camelcase: require('./rules/camelCase')
  },
  arefalse: {
    debug: require('./rules/debugger')
  }
}

function getRules(has) {
  var getRule = function (x) { return x[1] }
  var falseRule = function (x) { return has(x[0], false) }
  var trueRule = fu.comp(fu.not, falseRule)
  return fu.concat(
    RULES.builtin,
    fu.map(getRule, fu.filter(falseRule, fu.intoArray(RULES.aretrue))),
    fu.map(getRule, fu.filter(trueRule, fu.intoArray(RULES.arefalse)))
  )
}

function traverse(o, f, p) {
  var k, r = Array.isArray(o) ? [] : {}
  var self = function (x) { return traverse(x, f, p) }
  for (k in o) {
    if (toString.call(o[k]) == '[object Object]') {
      r[k] = traverse(o[k], f, o)
    } else if (Array.isArray(o[k])) {
      r[k] = fu.concatMap(self, o[k])
    } else {
      r[k] = o[k]
    }
  }
  return f(r, p)
}

function createIndent(n, indent) {
  return Array(n + 1).join(indent == 'spaces' ? ' ' : '\t')
}

function genHas(obj) {
  return function (key, fallback) {
    return obj.hasOwnProperty(key) && obj[key] !== undefined
      ? obj[key]
      : fallback
  }
}

fixMyJS.fix = function (code, config) {
  var ast = esprima.parse(code, { comment: true })
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
      escapeless: false,
      parentheses: true,
      semicolons: !has('asi', false)
    },
    parse: null,
    comment: true
  }

  var modifiedTree = traverse(ast, function (node, parent) {
    return fu.foldl(function (node, f) {
      return f.hasOwnProperty(node.type)
        ? f[node.type](node, parent)
        : node
    }, rules, node)
  })
  return escodegen.generate(modifiedTree, options)
}
