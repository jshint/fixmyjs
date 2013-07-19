module.exports = {
  UnaryExpression: rmDelete
}

// You shouldn't delete vars. This will remove the delete statement
// and instead set the variable to undefined.

function rmDelete(node) {
  if (node.operator != 'delete') {
    return node
  }

  if (node.argument.type != 'Identifier') {
    return node
  }

  return {
    type: 'AssignmentExpression',
    operator: '=',
    left: node.argument,
    right: { type: 'Identifier', name: 'undefined' }
  }
}
