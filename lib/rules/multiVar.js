module.exports = {
  VariableDeclaration: multiVarDecl
}

var fu = require('fu');

function multiVarDecl(node, parent) {
  if (node.kind !== 'var' || parent.type === 'ForStatement'
      || parent.type === 'ForOfStatement' || parent.type === 'ForInStatement'
      || node.declarations.length <= 1) {
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
