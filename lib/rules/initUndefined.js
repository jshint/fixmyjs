module.exports = {
  VariableDeclarator: rmInitUndefined
}

function rmInitUndefined(node) {
  if (!node.init ||
      node.init.type != 'Identifier' ||
      node.init.name != 'undefined') {
    return node
  }

  return {
    type: 'VariableDeclarator',
    id: node.id,
    init: null
  }
}
