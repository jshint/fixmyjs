module.exports = {
  NewExpression: rmBadConstructor
}

function isValidConstructor(node) {
  switch (node.name) {
    case 'Number':
    case 'String':
    case 'Boolean':
    case 'Math':
    case 'JSON':
      return false
    default:
      return true
  }
}

function rmBadConstructor(node) {
  if (node.callee.type != 'Identifier' || isValidConstructor(node.callee)) {
    return node
  }

  return {
    type: 'CallExpression',
    callee: node.callee,
    arguments: node.arguments
  }
}
