module.exports = function (opts) {
  return opts.snakecase ? { Identifier: toSnake } : {}
}

function toSnake(node, parent) {
  if (!/[a-z]([A-Z])/.test(node.name)) {
    return node
  }

  if (parent) {
    if (parent.type == 'Property') {
      return node
    }

    if (parent.type == 'MemberExpression' && parent.property === node) {
      return node
    }
  }

  return {
    type: 'Identifier',
    name: node.name.replace(/[a-z]([A-Z])/g, function (i) {
      return i[0] + '_' + i[1].toLowerCase()
    })
  }
}
