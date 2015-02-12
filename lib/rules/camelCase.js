module.exports = {
  Identifier: useCamelCase
}

var regex = /[a-z]_([a-z])/g

function useCamelCase(node, parent) {
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
      return i[0] + i[2].toUpperCase()
    })
  }
}
