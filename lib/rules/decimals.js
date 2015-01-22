module.exports = function (opts) {
  return opts.decimals ? { Literal: LeadingAndTrailingDecimals } : {}
}

function LeadingAndTrailingDecimals(node) {
  if (typeof node.value !== 'number') {
    return node
  } else {
    if (/^\./.test(node.raw) || /\.$/.test(node.raw)) {
      return {
        type: 'Literal',
        value: node.value
      }
    } else {
      return node
    }
  }
}
