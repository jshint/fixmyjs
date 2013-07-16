module.exports = {
  Identifier: useCamelCase
}

var regex = /[a-z]_([a-z])/g

function useCamelCase(node) {
  if (!regex.test(node.name)) {
    return node
  }

  return {
    type: 'Identifier',
    name: node.name.replace(regex, function (i) {
      return i[0] + i[2].toUpperCase()
    })
  }
}
