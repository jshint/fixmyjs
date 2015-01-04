module.exports = function (f, assert) {
  var options = {
    camelcase: false,
    curly: false,
    curlyfor: false,
    curlyif: false,
    curlywhile: false,
    debug: false,
    decimals: false,
    eqeqeq: false,
    initUndefined: false,
    invalidConstructor: false,
    invokeConstructors: false,
    isNan: false,
    multivar: false,
    nonew: false,
    parseIntRadix: false,
    plusplus: false,
    rmdelete: false,
    rmempty: false,
    snakecase: false,
    sub: false,
    trailingCommas: false,
    useLiteral: false
  }
  return {
    'all the options false': function () {
      var code = 'var foo;'
      assert.equal(f(code, options), code)
    }
  }
}
