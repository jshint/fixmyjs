module.exports = function (opts) {
  return opts.rmempty ? { EmptyStatement: rmEmpty } : {}
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
