module.exports = function (f, assert) {
  /*jshint quotmark: double*/
  var options = {
    "camelcase": false,
    "curly": true,
    "curlyfor": false,
    "curlyif": false,
    "curlywhile": false,
    "debug": true,
    "decimals": true,
    "eqeqeq": false,
    "es3": true,
    "initUndefined": true,
    "invalidConstructor": true,
    "invokeConstructors": true,
    "isNan": true,
    "multivar": false,
    "no-comma-dangle": true,
    "nonew": false,
    "parseIntRadix": true,
    "plusplus": true,
    "rmdelete": true,
    "rmempty": true,
    "snakecase": false,
    "sub": true,
    "useLiteral": true
  }

  /*jshint quotmark: single*/
  return {
    'all the options false': function () {
      var code = 'var foo;'
      assert.equal(f(code, options), code)
    }
  }
}
