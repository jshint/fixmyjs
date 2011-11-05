var fs = require('fs'),
  path = require('path'),
  sys = require('sys'),
  argsparser = require('argsparser'),
  glob = require('glob'),
  jshint = require('../packages/jshint/jshint'),
  _cache = {
    directories: {}
  };

function _removeJsComments(str) {
  str = str || '';
  str = str.replace(/\/\*[\s\S]*(?:\*\/)/g, ''); //everything between "/* */"
  str = str.replace(/\/\/[^\n\r]*/g, ''); //everything after "//"
  return str;
}

function _loadAndParseConfig(filePath) {
  var config = {},
    fileContent;

  try {
    if (path.existsSync(filePath)) {
      fileContent = fs.readFileSync(filePath, "utf-8");
      config = JSON.parse(_removeJsComments(fileContent));
    }
  } catch (e) {
    sys.puts("Error opening config file " + filePath + '\n');
    sys.puts(e + "\n");
    process.exit(1);
  }

  return config;
}

function _mergeConfigs(homerc, cwdrc) {
  var homeConfig = _loadAndParseConfig(homerc),
    cwdConfig = _loadAndParseConfig(cwdrc),
    prop;

  for (prop in cwdConfig) {
    if (typeof prop === 'string') {
      if (prop === 'predef') {
        homeConfig.predef = (homeConfig.predef || []).concat(cwdConfig.predef);
      } else {
        homeConfig[prop] = cwdConfig[prop];
      }
    }
  }

  return homeConfig;
}

function doLint(buffer, file, results, config, data) {
  var lintdata;

  config.maxerr = 500;
  if (!jshint.JSHINT(buffer, config)) {
    jshint.JSHINT.errors.forEach(function (error) {
      if (error) {
        results.push({file: file, error: error});
      }
    });
  }

  lintdata = jshint.JSHINT.data();

  if (lintdata) {
    lintdata.file = file;
    data.push(lintdata);
  }
}

function _lint(file, results, config, data) {
  var buffer;

  try {
    buffer = fs.readFileSync(file, 'utf-8');
  } catch (e) {
    sys.puts("Error: Cant open: " + file);
    sys.puts(e + '\n');
  }

  doLint(buffer, file, results, config, data);
}

function isDirectory(aPath) {
  var isDir;

  try {
    if (_cache.directories.hasOwnProperty(aPath)) {
      isDir = _cache.directories[aPath];
    } else {
      isDir = fs.statSync(aPath).isDirectory();
      _cache.directories[aPath] = isDir;
    }
  } catch (e) {
    isDir = false;
  }

  return isDir;
}


function _shouldIgnore(somePath, ignore) {
  function isIgnored(p) {
    var fnmatch = glob.fnmatch(p, somePath, ~(glob.FNM_PATHNAME | glob.FNM_CASEFOLD)),
      lsmatch = isDirectory(p) && p.match(/^[^\/]*\/?$/) &&
        somePath.match(new RegExp("^" + p + ".*"));

    return !!(fnmatch || lsmatch);
  }

  return ignore.some(function (ignorePath) {
    return isIgnored(ignorePath);
  });
}

function _collect(filePath, files, ignore) {
  if (ignore && _shouldIgnore(filePath, ignore)) {
    return;
  }

  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(function (item) {
      _collect(path.join(filePath, item), files, ignore);
    });
  } else if (filePath.match(/\.js$/)) {
    files.push(filePath);
  }
}

function JSHINT(targets, config, reporter, ignore) {
  var files = [],
    results = [],
    data = [];

  targets.forEach(function (target) {
    _collect(target, files, ignore);
  });

  files.forEach(function (file) {
    _lint(file, results, config, data);
  });

  _cache = {
    directories: {}
  };

  reporter(results, data, config);
}

module.exports = {
  interpret: function (args, callback, opts) {
    var config, reporter, ignore,
      options = argsparser.parse(args),
      pathsToIgnore = path.join(process.cwd(), '.jshintignore'),
      defaultConfig = path.join(process.env.HOME, '.jshintrc'),
      projectConfig = path.join(process.cwd(), '.jshintrc'),
      customConfig = options["--config"],
      customReporter = options["--reporter"] ? path.resolve(process.cwd(), options["--reporter"]) : null,
      targets = typeof options.node === "string" ? null : options.node.slice(1);

    if (customConfig) {
      config = _loadAndParseConfig(customConfig);
    } else {
      config = _mergeConfigs(defaultConfig, projectConfig);
    }

    if (path.existsSync(pathsToIgnore)) {
      ignore = fs.readFileSync(pathsToIgnore, "utf-8").split("\n").filter(function (line) {
        return !!line;
      });
    }

    JSHINT(targets, config, callback, ignore);
  }
};


