module.exports = function (f, assert) {
  var options = { onevar: true }
  return {
    'splits multivar declarations into one var only in functions': function () {
      var code = 'var a;\nvar b;'
      var real = f(code, options)
      assert.equal(real, code)
    },

    'splits multivar declarations into one var in declared functions': function () {
      var code = 'function foo() {\n  var a;\nvar b;\n}'
      var result = 'function foo() {\n  var a, b;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'splits multivar declarations into one var in function expressions': function () {
      var code = 'var foo = function() {\n  var a;\nvar b;\n}'
      var result = 'var foo = function() {\n  var a, b;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'multivar declarations spread out are hoisted with top ones remaining': function () {
      var code = [
        'function foo() {',
        '  var a = 1;',
        '  if (true) {',
        '    var b = 2;',
        '  }',
        '}'
      ].join('\n')
      var result = [
        'function foo() {',
        '  var a = 1, b;',
        '  if (true) {',
        '    b = 2;',
        '  }',
        '}'
      ].join('\n')
      var real = f(code, options)
      assert.equal(real, result)
    },

    'onevar declarations remain': function () {
      var code = [
        'function foo() {',
        '  var a = 1,',
        '      b = 2,',
        '      c = 3;',
        '}'
      ].join('\n')
      var result = 'function foo() {\n  var a = 1, b = 2, c = 3;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'onevar declarations remain and other var declarations are hoisted and turned into assignments': function () {
      var code = [
        'function foo() {',
        '  var a = 1,',
        '      b = 2,',
        '      c = 3;',
        '  if (true) {',
        '    var d = 4;',
        '  }',
        '  var e = 5;',
        '  var f = 6;',
        '}'
      ].join('\n')

      var result = [
        'function foo() {',
        '  var a = 1, b = 2, c = 3, d, e, f;',
        '  if (true) {',
        '    d = 4;',
        '  }',
        '  e = 5;',
        '  f = 6;',
        '}'
      ].join('\n')

      var real = f(code, options)

      assert.equal(real, result)
    },

    'onevar declarations remain and subsequent ones are added': function () {
      var code = [
        'function foo() {',
        '  var a = 1,',
        '      b = 2,',
        '      c = 3;',
        '  var d = 4;',
        '}'
      ].join('\n')
      var result = 'function foo() {\n  var a = 1, b = 2, c = 3, d = 4;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'should not split var declarations in loops': function () {
      var code = 'function foo() {\n  for (var i = 0, k = 1;;) {\n  }\n}'
      var real = f(code, options)
      assert.equal(real, code)
    }
  }
}
