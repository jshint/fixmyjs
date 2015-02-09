/*globals toString */
module.exports = traverse

var fu = require('fu')

function traverse(o, f, p) {
  var k

  function make(parent) {
    return function (node) {
      var next = traverse(node, f, parent)
      next === node || (next._fixmyjs = 1)
      return next
    }
  }

  if (o === undefined) {
    return o
  }

  for (k in o) {
    var call = make(o)

    if (toString.call(o[k]) == '[object Object]') {
      o[k] = call(o[k])
    } else if (Array.isArray(o[k])) {
      o[k] = fu.concatMap(call, o[k])
    }
  }

  return f(o, p)
}
