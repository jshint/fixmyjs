var test = new Test();
test.addFiles();
test.addTests();
vows.describe('fixmyjs').addBatch(test.specs).run({}, function () {
  _cj$_done();
})
