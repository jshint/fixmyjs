module.exports = fixMyJS

var esprima = require('esprima')
var escodegen = require('escodegen')
var fu = require('fu')

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
  require('./rules/camelCase'),
]

// XXX need parent information for 'dont use new for side effects'
function traverse(o, f) {
  var k, r = Array.isArray(o) ? [] : {}
  var self = function (o) { return traverse(o, f) }
  for (k in o) {
    r[k] = typeof o[k] == 'object' && o[k] !== null
      ? Array.isArray(o[k]) ? fu.concatMap(self, o[k]) : traverse(o[k], f)
      : o[k]
  }
  return f(r)
}

function fixMyJS(code) {
  var ast = esprima.parse(code)
  var modifiedTree = traverse(ast, function (node) {
    return fu.foldl(function (node, f) {
      return f.hasOwnProperty(node.type)
        ? f[node.type](node)
        : node
    }, rules, node)
  })
  return escodegen.generate(modifiedTree)
}

//var code = [
//  'var a = ((function () {',
//  '  return 2',
//  '}()) == NaN)',
//  'debugger',
//  'var foo = a["bananas"]',
//  'new Number(5)',
//  'new Array(10)',
//  'var g = undefined',
//  'parseInt("12")',
//  'var c = Array()',
//  'var d = Array(4)',
//  'g = Object()',
//  'for (;;) x',
//  'if (x) x; else x',
//  'if (false) x',
//  'while (true) { x }',
//  'while (true) x',
//  'a++',
//  'v--',
//  'for (i = 0; i < a.length; i++) i',
//  'snake_case_not_tolerated',
//  '_leadingisok',
//  '__wtf',
//  'yeah_',
//  'yeah_n',
//  'double__is_good_too',
//  'whatAboutCamelCase',
//].join('\n')
//
//console.log(fixMyJS(code))
