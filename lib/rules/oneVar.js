module.exports = function (opts) {
  return opts.onevar ? {
    FunctionDeclaration: oneVarDecl,
    FunctionExpression: oneVarDecl
  } : {}
}

var fu = require('fu')
var recast = require('recast')
var traverse = require('../traverse')

var b = recast.types.builders

function oneVarDecl(tree) {
  var variableDeclarations = fu.takeWhile(function (node) {
    return node.type === 'VariableDeclaration'
  }, tree.body.body)

  var vars = fu.concatMap(function (node) {
    return fu.map(function (declarator) {
      return [declarator.id, declarator.init]
    }, node.declarations)
  }, variableDeclarations)

  var builderFunction = tree.type === 'FunctionExpression'
    ? 'functionExpression'
    : 'functionDeclaration'

  var block = {
    type: 'BlockStatement',
    body: fu.drop(variableDeclarations.length, tree.body.body)
  }

  var restTree = b[builderFunction](tree.id, tree.params, block)

  var modifiedTree = traverse(restTree, function (node, parent) {
    if (node.type === 'VariableDeclaration') {
      if (node.kind !== 'var' || parent.type === 'ForStatement') {
        return node
      }

      return fu.map(function (declarator) {
        vars.push([declarator.id, undefined])
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: declarator.id,
            right: declarator.init
          }
        }
      }, node.declarations)

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
