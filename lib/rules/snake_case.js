module.exports = {
  Identifier: toSnake
}

var regex = /[a-z]([A-Z])/g

function toSnake(node, parent) {
  if (!regex.test(node.name) || parent.type == 'Property' ||
      parent.type == 'MemberExpression') {
    return node
  }

  return {
    type: 'Identifier',
    name: node.name.replace(regex, function (i) {
      return i[0] + '_' + i[1].toLowerCase()
    })
  }
}
