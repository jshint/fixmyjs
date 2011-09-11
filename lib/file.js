var fs = require('fs');

var oEach = function (obj, fn) {
  Object.keys(obj).forEach(function (key) {
    fn(obj[key]);
  });
};


var File = function (fileName) {
  if (File.cache.hasOwnProperty(fileName)) {
    return File.cache[fileName];
  }

  this.fileName = fileName;
  File.cache[fileName] = this;
};

File.cache = {};

File.showDiff = function () {
  oEach(File.cache, function (file) {
    if (file.isModified()) {
      // TODO output std patch
      var diff = require('./jsdiff').diffString(file.file, file.lines.join("\n"));
      process.stdout.write("@ " + file.fileName + "\n");
      process.stdout.write(diff + "\n");
    }
  });
  process.stdout.write("Done.\n");
};

File.writeFiles = function () {
  oEach(File.cache, function (file) {
    file.writeFile();
  });
  process.stdout.write("Done.\n");
};

File.prototype.readAndFix = function (line, chr, fn) {
  if (!this.file) {
    this.readFile();
  }
  this.fix(line, chr, fn);
};

File.prototype.isModified = function () {
  return (!!this.lines);
};

File.prototype.readFile = function () {
  this.file = fs.readFileSync(this.fileName, 'utf8');
  this.lines = this.file.split("\n");
};

File.prototype.writeFile = function () {
  if (this.isModified()) {
    fs.writeFileSync(this.fileName, this.lines.join("\n"), 'utf8');
  }
};

File.prototype.fix = function (line, chr, fn) {
  this.lines[line] = fn(this.lines[line], chr);
};

module.exports = File;
