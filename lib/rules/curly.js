module.exports = {
  ForStatement: addCurly,
  WhileStatement: addCurly,
  IfStatement: addCurlyIfStmt
}

var fu = require('fu')

function merge(node, properties) {
  return fu.foldl(function (node, x) {
    if (node.hasOwnProperty(x[0])) {
      node[x[0]] = x[1]
    }
    return node
  }, fu.intoArray(properties), node)
}

function wrapInCurlies(node) {
  return {
    type: 'BlockStatement',
    body: [node]
  }
}

function addCurly(node) {
  if (node.body.type == 'BlockStatement') {
    return node
  }

  return merge(node, {
    body: wrapInCurlies(node.body)
  })
}

function addCurlyIfStmt(node) {
  var code_paths = [
    ['consequent', node.consequent],
    ['alternate', node.alternate]
  ]

  var uncurlied = fu.filter(function (x) {
      return x[1] != null &&
          !(x[0] == 'alternate' && x[1].type == 'IfStatement') &&
          x[1].type != 'BlockStatement'
  }, code_paths)

  return uncurlied.length === 0
    ? node
    : merge(node, fu.intoObject(fu.map(function (x) {
        return [x[0], wrapInCurlies(x[1])]
      }, uncurlied)))
}
