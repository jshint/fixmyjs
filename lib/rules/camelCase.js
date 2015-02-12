module.exports = function (opts) {
  return opts.camelcase ? { Identifier: useCamelCase } : {}
}

function useCamelCase(node, parent) {
  if (!/[a-z]_([a-z])/.test(node.name)) {
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
    name: node.name.replace(/[a-z]_([a-z])/g, function (i) {
      return i[0] + i[2].toUpperCase()
    })
  }
}
