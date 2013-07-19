module.exports = {
  CallExpression: useLiteral,
  NewExpression: useLiteral
}

function canBeLiteral(node) {
  switch (node.name) {
    case 'Array':
    case 'Object':
      return true
    default:
      return false
  }
}

function getNode(node) {
  return node.name == 'Array'
    ? { type: 'ArrayExpression', elements: [] }
    : { type: 'ObjectExpression', properties: [] }
}

function useLiteral(node) {
  if (node.callee.type != 'Identifier' ||
      !canBeLiteral(node.callee) ||
      node.arguments.length > 0) {
    return node
  }

  return getNode(node.callee)
}
