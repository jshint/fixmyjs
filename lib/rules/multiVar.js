module.exports = {
  VariableDeclaration: multiVarDecl
}

var fu = require('fu');

function multiVarDecl(node) {
  if (node.kind !== 'var' || node.declarations.length <= 1) {
    return node
  }

  return fu.map(function(decl) {
    return {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: [ decl ]
    };
  }, node.declarations);
}
