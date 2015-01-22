module.exports = function (opts) {
  return opts.hoist ? {
    FunctionDeclaration: hoistIt,
    FunctionExpression: hoistIt
  } : {}
}

var fu = require('fu')

var traverse = require('../traverse')

function hoistIt(tree) {
  var vars = []

  var modifiedTree = traverse(tree, function (node, parent) {
    if (node.type === 'VariableDeclaration') {

      if (node.kind !== 'var') {
        return node
      }

      var nodes = fu.map(function (declarator) {
        vars.push([declarator.id, undefined])

        if (declarator.init === null) {
          return { type: 'EmptyStatement' }
        }

        var assign = {
          type: 'AssignmentExpression',
          operator: '=',
          left: declarator.id,
          right: declarator.init
        }

        if (parent.type === 'ForStatement') {
          return assign
        } else {
          return {
            type: 'ExpressionStatement',
            expression: assign
          }
        }
      }, node.declarations)

      if (parent.type === 'ForStatement' && node.declarations.length > 1) {
        return {
          type: 'SequenceExpression',
          expressions: nodes
        }
      } else {
        return nodes.length === 1 ? nodes[0] : nodes
      }
    } else {
      return node
    }
  })

  if (vars.length) {
    modifiedTree.body.body.unshift({
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: fu.map(function (node) {
        return {
          type: 'VariableDeclarator',
          id: node[0],
          init: node[1]
        }
      }, vars)
    })
  }

  return modifiedTree
}
