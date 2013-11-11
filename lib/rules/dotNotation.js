module.exports = {
  MemberExpression: rewriteDotNotation
}

var fu = require('fu')

var validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
var keywords = [
  'this',
  'function',
  'if',
  'return',
  'var',
  'else',
  'for',
  'new',
  'arguments',
  'in',
  'typeof',
  'while',
  'case',
  'break',
  'try',
  'catch',
  'delete',
  'throw',
  'switch',
  'continue',
  'default',
  'instanceof',
  'do',
  'void',
  'finally',
  'with',
  'debugger',
  'eval',
  'implements',
  'interface',
  'package',
  'private',
  'protected',
  'public',
  'static',
  'yield',
  'let',
  'class',
  'enum',
  'export',
  'extends',
  'import',
  'super'
]

function rewriteDotNotation(node) {
  if (node.computed === false || node.property.type != 'Literal') {
    return node
  }

  if (validIdentifier.test(node.property.value) &&
      !fu.elem(node.property.value, keywords)) {
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
