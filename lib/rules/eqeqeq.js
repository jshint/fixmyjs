module.exports = {
  BinaryExpression: toStrictEquality
}

function toStrictEquality(node) {
  if (node.operator != '==' && node.operator != '!=') {
    return node
  }

  return {
    type: 'BinaryExpression',
    operator: node.operator == '==' ? '===' : '!==',
    left: node.left,
    right: node.right
  }
}
