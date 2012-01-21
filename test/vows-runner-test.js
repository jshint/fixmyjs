var vows = require('vows');
var tests = require('./specs');
var files = (process.argv[1].indexOf('vows') === -1) ? process.argv[2] : undefined;
tests.test.addFiles(files);
files || tests.test.addTests();
vows.describe('fixmyjs').addBatch(tests.test.specs).export(module);
