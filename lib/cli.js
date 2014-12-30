var commander = require('commander')
var diff = require('diff')
var fixmyjs = require('../')
var fs = require('fs')
var fu = require('fu')
var minimatch = require('minimatch')
var path = require('path')
var pkg = require('../package.json')

Object.assign = Object.assign || require('object-assign')

function getConfigAt(dir) {
  try {
    return require(path.join(dir, 'package.json')).fixmyjs
  } catch (e) {
    return {}
  }
}

function getConfig() {
  return getConfigAt(process.CWD)
}

function printDiff(a, b) {
  if (a == b) {
    return
  }

  var DARK = '\x1b[90m'
  var GREEN = '\x1b[32m'
  var RED = '\x1b[31m'
  var RESET = '\x1b[39m'

  var df = diff.diffLines(a, b)
  var content = fu.map(function (n) {
    var line = df[n]
    if (line.removed) {
      return RED + line.value
    } else if (line.added) {
      return GREEN + line.value
    } else {
      return DARK + line.value
    }
  }, Object.keys(df))
  console.log(content.join(RESET + '\n'), RESET)
}

function createPatch(fileName, a, b) {
  console.log(diff.createPatch(fileName, a, b, '', ''))
}

function isDir(fullpath) {
  try {
    return fs.statSync(fullpath).isDirectory()
  } catch (ex) {
    if (ex.code == 'ENOENT') {
      console.error(String(ex))
    }
    return null
  }
}

function shouldIgnorePath(fullpath, ignore) {
  return fu.any(function (ignoreRule) {
    var fnmatch = minimatch(fullpath, ignoreRule, { nocase: true })
    var lsmatch = Boolean(
      isDir(ignoreRule) &&
      ignoreRule.match(/^[^\/]*\/?$/) &&
      fullpath.match(new RegExp('^' + ignoreRule + '.*'))
    )
    return !!(fnmatch || lsmatch)
  }, ignore)
}

function shouldFixFile(fileName, ignore) {
  return (/\.js$/).test(fileName) && !shouldIgnorePath(fileName, ignore)
}

function genFixForFile(file, config) {
  return function () {
    var content = fs.readFileSync(file).toString()
    var fixed = ''

    try {
      fixed = fixmyjs.fix(content, config)
    } catch (ex) {
      ex.stack = 'File: ' + file + '\n' + ex.stack
      throw ex
    }

    if (commander.silent) {
      return true
    } else if (commander.dryRun || commander.diff) {
      printDiff(content, fixed)
    } else if (commander.patch) {
      createPatch(file, content, fixed)
    } else {
      fs.writeFileSync(file, fixed, 'utf8')
    }

    console.log('\u2713 ' + path.basename(file) + ' done.')

    return content === fixed
  }
}

function traverseFiles(_, fileName) {
  var fullpath = path.resolve(fileName)

  switch (isDir(fullpath)) {
    case true:
      if (shouldIgnorePath(fullpath, _.ignore)) {
        return []
      }
      var config = Object.assign(_.config, getConfigAt(fullpath))
      var ignore = fu.concat(_.ignore, config.ignore || [])
      return fu.concatMap(function (x) {
        return traverseFiles({
          ignore: ignore,
          config: config
        }, path.join(fileName, x))
      }, fs.readdirSync(fullpath))
    case false:
      return shouldFixFile(fullpath, _.ignore)
        ? [genFixForFile(fullpath, _.config)]
        : []
    case null:
      return [fu.apply(function () { return false })]
  }
}

function cli() {
  var SUCCESS = 0
  var ERROR = 1

  var findFiles = fu.curry(traverseFiles, {
    ignore: [],
    config: Object.assign(
      {},
      pkg.fixmyjs,
      getConfig(),
      getConfigAt(commander.config)
    )
  })
  var filesToLint = fu.concatMap(findFiles, commander.args)

  process.exit(fu.foldl(function (statusCode, fn) {
    return fn()
      ? statusCode == ERROR ? ERROR : SUCCESS
      : ERROR
  }, filesToLint, SUCCESS))
}

commander
  .option('-c, --config [.jshintrc]', 'Load your own config file')
  .option('-d, --diff', 'Similar to dry-run')
  .option('-p, --patch', 'Output a patch file to stdout')
  .option('-r, --dry-run', 'Performs a dry-run and shows you a diff')
  .option('-s, --silent', 'A useless option')
  .parse(process.argv)

if (commander.args.length === 0) {
  commander.emit('help')
} else {
  cli()
}
