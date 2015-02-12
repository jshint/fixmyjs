module.exports = {
  Identifier: toSnake
}

var regex = /[a-z]([A-Z])/g

function toSnake(node, parent) {
  if (!regex.test(node.name)) {
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
    name: node.name.replace(regex, function (i) {
      return i[0] + '_' + i[1].toLowerCase()
    })
  }
}
