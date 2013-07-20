module.exports = fixMyJS = require('./legacy')

var esprima = require('esprima')
var escodegen = require('escodegen')
var fu = require('fu')

// XXX add rules based on config
var rules = [
  require('./rules/isNaN'),
  require('./rules/delete'),
  require('./rules/debugger'),
  require('./rules/dotNotation'),
  require('./rules/invalidConstructor'),
  require('./rules/initUndefined'),
  require('./rules/parseInt'),
  require('./rules/useLiteral'),
  require('./rules/curly'),
  require('./rules/updateExpression'),
  require('./rules/emptyStatement'),
//  require('./rules/camelCase'),
]

// XXX need parent information for 'dont use new for side effects'
function traverse(o, f) {
  var k, r = Array.isArray(o) ? [] : {}
  var self = function (o) { return traverse(o, f) }
  for (k in o) {
    if (toString.call(o[k]) == '[object Object]') {
      r[k] = traverse(o[k], f)
    } else if (Array.isArray(o[k])) {
      r[k] = fu.concatMap(self, o[k])
    } else {
      r[k] = o[k]
    }
  }
  return f(r)
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

  var modifiedTree = traverse(ast, function (node) {
    return fu.foldl(function (node, f) {
      return f.hasOwnProperty(node.type)
        ? f[node.type](node)
        : node
    }, rules, node)
  })
  return escodegen.generate(modifiedTree, options)
}
