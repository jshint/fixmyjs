module.exports = {
  MemberExpression: rewriteDotNotation
}

var validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

function rewriteDotNotation(node) {
  if (node.computed == false || node.property.type !== 'Literal') {
    return node
  }

  // XXX TODO check for reserved words
  if (validIdentifier.test(node.property.value)) {
    return {
      type: 'MemberExpression',
      computed: false,
      object: node.object,
      property: {
        type: 'Identifier',
        name: node.property.value
      }
    }
  } else {
    return node
  }
}
