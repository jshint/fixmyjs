module.exports = {
  UpdateExpression: rmPostfix
}

function rmPostfix(node) {
  if (node.operator != '--' && node.operator != '++') {
    return node
  }

  return {
    type: 'AssignmentExpression',
    operator: node.operator == '++' ? '+=' : '-=',
    left: node.argument,
    right: {
      type: 'Literal',
      value: 1
    }
  }
}
