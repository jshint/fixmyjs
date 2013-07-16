var esprima = require('esprima')
var escodegen = require('escodegen')
var fu = require('fu')

var rules = [
  require('./lib/isNaN'),
  require('./lib/delete')
]

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
  return traverse(ast, function (node) {
    return fu.foldl(function (node, f) {
      return f.hasOwnProperty(node.type)
        ? f[node.type](node)
        : node
    }, rules, node)
  })
}

var code = [
//  'var a = ((function () {',
//  '  return 2',
//  '}()) == NaN)'
  'delete foo'
].join('\n')

console.log(escodegen.generate(fixMyJS(code)))
