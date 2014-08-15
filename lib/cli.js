var commander = require('commander')
var diff = require('diff')
var fixmyjs = require('../')
var fs = require('fs')
var fu = require('fu')
var jshint = require('jshint').JSHINT
var minimatch = require('minimatch')
var path = require('path')

function removeJsComments(str) {
  return (str || '')
    .replace(/\/\*[\s\S]*(?:\*\/)/g, '') //everything between '/* */'
    .replace(/\/\/[^\n\r]*/g, '') //everything after '//'
}

function loadAndParseConfig(filePath) {
  if (typeof filePath === 'object') {
    return filePath
  }

  try {
    return fs.existsSync(filePath)
      ? JSON.parse(removeJsComments(fs.readFileSync(filePath, 'utf-8')))
      : {}
  } catch (ex) {
    console.error('Error opening config file ' + filePath)
    console.error(ex)
    process.exit(1)
  }
}

function mergeConfig(a, b) {
  var config = fu.merge({}, a)
  Object.keys(b).forEach(function (key) {
    if (key == 'predef') {
      config.predef = fu.concat(config.predef || [], b.predef)
    } else {
      config[key] = b[key]
    }
  })
  return config
}

function getConfigAtPath(fullpath) {
  return loadAndParseConfig(fullpath)
}

function getConfig(dir) {
  return loadAndParseConfig(path.join(dir, '.jshintrc'))
}

function getIgnore(dir) {
  var PATH_TO_IGNORE = path.join(dir, '.jshintignore')
  var ignoreRules = fs.existsSync(PATH_TO_IGNORE)
    ? fu.compact(fs.readFileSync(PATH_TO_IGNORE, 'utf-8').split('\n'))
    : []

  return fu.map(function (ignoreRule) {
    return path.join(dir, ignoreRule)
  }, ignoreRules)
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

function shouldLintFile(fileName, ignore) {
  return (/\.js$/).test(fileName) && !shouldIgnorePath(fileName, ignore)
}

function genFixForFile(file, config) {
  return function () {
    var content = fs.readFileSync(file).toString()
    var fixed = ''

    var fmjOptions = commander.indentPref
      ? fu.merge(config, { indentpref: commander.indentPref })
      : config

    try {
      if (commander.legacy) {
        jshint(content, config)
        fixed = fixmyjs(jshint.data(), content, fmjOptions).run()
      } else {
        fixed = fixmyjs.fix(content, fmjOptions)
      }
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
      var ignore = fu.concat(_.ignore, getIgnore(fullpath))
      var config = mergeConfig(_.config, getConfig(fullpath))
      return fu.concatMap(function (x) {
        return traverseFiles({
          ignore: ignore,
          config: config
        }, path.join(fileName, x))
      }, fs.readdirSync(fullpath))
    case false:
      return shouldLintFile(fullpath, _.ignore)
        ? [genFixForFile(fullpath, _.config)]
        : []
    case null:
      return [fu.apply(function () { return false })]
  }
}

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
}

function cli() {
  var SUCCESS = 0
  var ERROR = 1

  var findFiles = fu.curry(traverseFiles, {
    ignore: [],
    config: mergeConfig(
      getConfig(getUserHome()),
      commander.config
        ? getConfigAtPath(commander.config)
        : {}
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
  .option('-l, --legacy', 'Use legacy fixmyjs')
  .option('-n, --indent-pref [tabs|spaces]', 'Your indentation preference')
  .option('-p, --patch', 'Output a patch file to stdout')
  .option('-r, --dry-run', 'Performs a dry-run and shows you a diff')
  .option('-s, --silent', 'A useless option')
  .parse(process.argv)

if (commander.args.length === 0) {
  commander.emit('help')
} else {
  cli()
}
