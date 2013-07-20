module.exports = {
  NewExpression: noSideEffects
}

function noSideEffects(node, parent) {
  if (parent.type !== 'ExpressionStatement') {
    return node
  }

  return {
    type: 'CallExpression',
    callee: node.callee,
    arguments: []
  }
}
