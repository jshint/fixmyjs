module.exports = {
  EmptyStatement: rmEmpty
}

function rmEmpty(node, parent) {
  if (parent) {
    switch (parent.type) {
      case 'ForStatement':
      case 'IfStatement':
      case 'WhileStatement':
        return node
    }
  }
  return []
}
