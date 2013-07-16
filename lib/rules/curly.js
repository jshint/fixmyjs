module.exports = {
  ForStatement: addCurly,
  WhileStatement: addCurly,
  IfStatement: addCurlyIfStmt
}

var fu = require('fu')

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

  return fu.merge(node, {
    body: wrapInCurlies(node.body)
  })
}

function addCurlyIfStmt(node) {
  if (node.consequent.type == 'BlockStatement' &&
     node.alternate && node.alternate.type == 'BlockStatement') {
    return node
  }

  var consequent = wrapInCurlies(node.consequent)

  return node.alternate === null
    ? fu.merge(node, {
      consequent: consequent
    })
    : fu.merge(node, {
      consequent: consequent,
      alternate: wrapInCurlies(node.alternate)
    })
}
