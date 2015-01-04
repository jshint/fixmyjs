module.exports = function (opts) {
  return opts.trailingCommas ? { ArrayExpression: removeTrailing, ObjectExpression: removeTrailing } : {}
}

var trailingComma = /,[}|\]]/

function removeTrailing(node, _, code) {
  if (!trailingComma.test(code)) {
    return node
  }

  if (node.type === 'ArrayExpression') {
    return {
      _: 'TO PRINT',
      type: 'ArrayExpression',
      elements: node.elements
    }
  } else {
    return {
      _: 'TO PRINT',
      type: 'ObjectExpression',
      properties: node.properties
    }
  }
}
