module.exports = function (opts) {
  return opts.debug ? { DebuggerStatement: rmDebuggerStmt } : {}
}

function rmDebuggerStmt() {
  return {
    type: 'EmptyStatement'
  }
}
