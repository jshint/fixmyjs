module.exports = {
  builtin: [
    rule('delete'),
    rule('dotNotation'),
    rule('emptyStatement'),
    rule('initUndefined'),
    rule('invalidConstructor'),
    rule('isNaN'),
    rule('parseInt'),
    rule('useLiteral'),
  ],
  aretrue: {
    camelcase: rule('camelCase'),
    curly: rule('curly'),
    nonew: rule('newSideEffects'),
    snakecase: rule('snake_case'),
    plusplus: rule('updateExpression'),
  },
  arefalse: {
    debug: rule('debugger'),
  }
}

function rule(x) {
  return require('./rules/' + x + '.js')
}
