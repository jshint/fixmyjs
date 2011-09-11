var fs = require('fs');

var File = function (fileName) {
  if (File.cache.hasOwnProperty(fileName)) {
    return File.cache[fileName];
  }

  this.fileName = fileName;
  File.cache[fileName] = this;
};

File.cache = {};

File.showDiff = function () {
};

File.writeFiles = function () {
  Object.keys(File.cache).forEach(function (key) {
    var file = File.cache[key];
    file.writeFile();
  });
  process.stdout.write("Done.\n");
};

File.prototype.readAndFix = function (line, chr, fn) {
  if (!this.lines) {
    this.readFile();
  }
  this.fix(line, chr, fn);
};

File.prototype.readFile = function () {
  this.file = fs.readFileSync(this.fileName, 'utf8');
  this.lines = this.file.split("\n");
};

File.prototype.writeFile = function () {
  fs.writeFileSync(this.fileName, this.lines.join("\n"), 'utf8');
};

File.prototype.fix = function (line, chr, fn) {
  this.lines[line] = fn(this.lines[line], chr);
};

module.exports = File;
