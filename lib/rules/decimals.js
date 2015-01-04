module.exports = function (opts) {
  return opts.decimals ? { Literal: LeadingAndTrailingDecimals } : {}
}

function LeadingAndTrailingDecimals(node) {
  if (typeof node.value !== 'number') {
    return node
  }

  return {
    type: 'Literal',
    value: node.value
  }
}
