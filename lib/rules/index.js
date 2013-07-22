module.exports = {
  builtin: [
    require('./delete'),
    require('./dotNotation'),
    require('./emptyStatement'),
    require('./initUndefined'),
    require('./invalidConstructor'),
    require('./isNaN'),
    require('./parseInt'),
    require('./useLiteral'),
  ],
  aretrue: {
    camelcase: require('./camelCase'),
    curly: require('./curly'),
    nonew: require('./newSideEffects'),
    snakecase: require('./snake_case'),
    plusplus: require('./updateExpression'),
  },
  arefalse: {
    debug: require('./debugger'),
  }
}
