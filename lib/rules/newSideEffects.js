module.exports = {
  NewExpression: noSideEffects
}

function noSideEffects(node, parent) {
  if (parent.type !== 'ExpressionStatement' || parent.expression.type === 'CallExpression') {
    return node
  }

  return {
    type: 'CallExpression',
    callee: node.callee,
    arguments: []
  }
}
