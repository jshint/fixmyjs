module.exports = function (f, assert) {
  var options = { hoist: true }
  return {
    'hoist all the variables only in functions': function () {
      var code = 'var a;\nvar b;'
      var real = f(code, options)
      assert.equal(real, code)
    },

    'hoist vars in a function': function () {
      var code = 'function foo() {\n  var a;\nvar b;\n}'
      var result = 'function foo() {\n  var a, b;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'hoist vars in function expressions': function () {
      var code = 'var foo = function() {\n  var a;\nvar b;\n}'
      var result = 'var foo = function() {\n  var a, b;\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'hoist all the vars': function () {
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
        '  var a, b;',
        '  a = 1;',
        '  if (true) {',
        '    b = 2;',
        '  }',
        '}'
      ].join('\n')
      var real = f(code, options)
      assert.equal(real, result)
    },

    'onevar declarations get hoisted': function () {
      var code = [
        'function foo() {',
        '  var a = 1,',
        '      b = 2,',
        '      c = 3;',
        '}'
      ].join('\n')
      var result = [
        'function foo() {',
        '  var a, b, c;',
        '  a = 1;',
        '  b = 2;',
        '  c = 3;',
        '}'
      ].join('\n')
      var real = f(code, options)
      assert.equal(real, result)
    },

    'all var declarations are hoisted regardless of where they are': function () {
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
        '  var a, b, c, d, e, f;',
        '  a = 1;',
        '  b = 2;',
        '  c = 3;',
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

    'hoist the for loops too': function () {
      var code = 'function foo() {\n  for (var i = 0, k = 1;;) {\n  }\n}'
      var result = 'function foo() {\n  var i, k;\n  for (i = 0, k = 1; ; ) {\n  }\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'hoist the single for loops too': function () {
      var code = 'function foo() {\n  for (var i = 0;;) {\n  }\n}'
      var result = 'function foo() {\n  var i;\n  for (i = 0; ; ) {\n  }\n}'
      var real = f(code, options)
      assert.equal(real, result)
    },

    'dont hoist the let': function () {
      var code = 'function foo() {\n  let a = 1;\n}'
      var real = f(code, options)
      assert.equal(real, code)
    }
  }
}
