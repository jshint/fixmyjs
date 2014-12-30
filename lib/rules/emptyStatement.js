module.exports = {
  EmptyStatement: rmEmpty
}

function rmEmpty(node, parent) {
  switch (parent.type) {
    case 'ForStatement':
    case 'IfStatement':
    case 'WhileStatement':
      return node
    default:
      return []
  }
}
