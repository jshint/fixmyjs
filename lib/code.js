var Code = function (str) {
  this.lines = str.split("\n");
  this._lines = str.split("\n");
};

Code.prototype.fix = function (fn, line) {
  var args = Array.prototype.slice.call(arguments, 2);

  args.unshift(this.lines[line]);

  this.lines[line] = fn.apply(this, args);
};

Code.prototype.getLineChrDiff = function (r) {
  var tabs;
  var lineNo = r.line;

  if (!this.lines) {
    this.readFile();
  }

  tabs = this.lines[lineNo].split("\t");

  return this.lines[lineNo].length - this._lines[lineNo].length - ((tabs ? tabs.length : 0) - 1);
};

Code.prototype.toString = function () {
  return this.lines.join("\n");
};

module.exports = Code;
