module.exports = function (f, assert) {
  /*jshint quotmark: double*/
  var options = {
    "camelcase": false,
    "curly": false,
    "curlyfor": false,
    "curlyif": false,
    "curlywhile": false,
    "debug": false,
    "decimals": false,
    "eqeqeq": false,
    "es3": false,
    "hoist": false,
    "initUndefined": false,
    "invalidConstructor": false,
    "invokeConstructors": false,
    "isNan": false,
    "multivar": false,
    "no-comma-dangle": false,
    "nonew": false,
    "onevar": false,
    "parseIntRadix": false,
    "plusplus": false,
    "rmdelete": false,
    "rmempty": false,
    "snakecase": false,
    "sub": false,
    "useLiteral": false
  }

  /*jshint quotmark: single*/
  return {
    'all the options false': function () {
      var code = 'var foo;'
      assert.equal(f(code, options), code)
    }
  }
}
