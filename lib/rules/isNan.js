module.exports = function (opts) {
  return opts.isNan ? { BinaryExpression: fixNaNComparisons } : {}
}

// Uses isNaN function rather than comparing to NaN.
//
// It's the same reason you shouldn't compare with undefined.
// NaN can be redefined. Although comparing to NaN is faster
// than using the isNaN function.

var fu = require('fu')
var comparisonOperators = /(=)==?/

function isNaNIdentifier(node) {
  return node.type == 'Identifier' && node.name == 'NaN'
}

function isNaNComparison(left, right) {
  return fu.any(isNaNIdentifier, [left, right])
}

function getOtherNode(left, right) {
  return fu.filter(function (node) {
    return !isNaNIdentifier(node)
  }, [left, right])
}

function fixNaNComparisons(node) {
  if (!comparisonOperators.test(node.operator) ||
      !isNaNComparison(node.left, node.right)) {
    return node
  }

  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'isNaN'
    },
    arguments: getOtherNode(node.left, node.right)
  }
}
