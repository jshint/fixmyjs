module.exports = function (opts) {
  return opts['no-comma-dangle'] || opts.es3 ? { ArrayExpression: removeTrailing, ObjectExpression: removeTrailing } : {}
}

var trailingComma = /,[}|\]]/

function removeTrailing(node, _, code) {
  if (!trailingComma.test(code)) {
    return node
  }

  if (node.type === 'ArrayExpression') {
    return {
      type: 'ArrayExpression',
      elements: node.elements
    }
  } else {
    return {
      type: 'ObjectExpression',
      properties: node.properties
    }
  }
}
