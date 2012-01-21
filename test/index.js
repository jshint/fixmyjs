var fs = require('fs');
var coverage = require('coveraje').coveraje;
var useServer = (process.argv[2] === 'server');
var vm = require('vm');

function reporter(instance) {
  var results = instance.runtime.getResults();
  var total = results.total;

  console.log('Coverage:', total + '%');

  if (!useServer) {
    process.exit(total < 90);
  }
}

function tests(self) {
  return coverage.runHelper.createEmitter(function (event) {
    self._cj$_done = event.complete;
    self.vows = require('vows');

    self.require = require;
    self.module = module;
    self.exports = exports;
    self.__dirname = __dirname;
    self.process = { argv: [] };

    vm.runInNewContext(fs.readFileSync(__dirname + '/specs.js', 'utf-8'), self, 'vows.vm');
    vm.runInNewContext(fs.readFileSync(__dirname + '/lib/vows-coveraje.js', 'utf-8'), self, 'vows.vm');
  });
};

// Use coveraje.
coverage.cover(fs.readFileSync(__dirname + '/../fixmyjs.js', 'utf-8'), tests, {
  useServer: useServer,
  quiet: true
}, reporter);
