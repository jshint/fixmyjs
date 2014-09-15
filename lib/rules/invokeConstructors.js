module.exports = {
  NewExpression: invokeConstructor
}

var invocable = /\(\)$/

function invokeConstructor(node, _, code) {
  if (node.arguments.length > 0) {
    return node
  }
  if (invocable.test(code)) {
    return node
  }
  return {
    _: 'PRINT',
    type: 'NewExpression',
    callee: node.callee,
    arguments: []
  }
}
