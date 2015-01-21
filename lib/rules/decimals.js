module.exports = function (opts) {
  return opts.decimals ? { Literal: LeadingAndTrailingDecimals } : {}
}

function LeadingAndTrailingDecimals(node) {
  if (typeof node.value !== 'number') {
    return node
  }

  if (typeof node.value === 'number') {
    if (/^./.test(node.raw) || /.$/.test(node.raw)) {
      return {
        type: 'Literal',
        value: node.value
      }
    }
  }

  return node
}
