module.exports = function (f, assert) {
    var options = { curly: true }
    return {
        'leave elseif\'s be': function () {
            var code = 'if (x) x; else if (x || y) x;'
            var result = 'if (x) {\n  x;\n} else if (x || y) {\n  x;\n}'
            assert.equal(f(code, options), result)
        }
    };
}
