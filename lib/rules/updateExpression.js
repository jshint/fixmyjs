module.exports = function (opts) {
  return opts.plusplus ? { UpdateExpression: rmPostfix } : {}
}

function rmPostfix(node) {
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
