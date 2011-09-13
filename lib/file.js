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
      // TODO fix indentation in diffs
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

File.prototype.isModified = function () {
  return (!!this.lines);
};

File.prototype.readFile = function () {
  this.file = fs.readFileSync(this.fileName, 'utf8');
  this.lines = this.file.split("\n");
  this._lines = this.lines.slice(0);
};

File.prototype.writeFile = function () {
  if (this.isModified()) {
    fs.writeFileSync(this.fileName, this.lines.join("\n"), 'utf8');
  }
};

File.prototype.fix = function (fn, line) {
  var args = Array.prototype.slice.call(arguments, 2);

  if (!this.lines) {
    this.readFile();
  }

  args.unshift(this.lines[line]);

  this.lines[line] = fn.apply(this, args);
};

File.prototype.getLineChrDiff = function (r, lineNo) {
  if (!this.lines) {
    this.readFile();
  }
  lineNo = r.line;

  var len = this.lines[lineNo].split("\t").length - 1;
  return this.lines[lineNo].length - this._lines[lineNo].length - (len * r.config.indent);
};

module.exports = File;
