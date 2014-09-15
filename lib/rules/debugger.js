module.exports = {
  DebuggerStatement: rmDebuggerStmt
}

function rmDebuggerStmt() {
  return {
    type: 'EmptyStatement'
  }
}
