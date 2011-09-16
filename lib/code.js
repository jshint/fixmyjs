var Code = function (str) {
  this.code = str.split("\n");
};

Code.prototype.fix = function (fn, line) {
  var args = Array.prototype.slice.call(arguments, 2);

  args.unshift(this.code[line]);

  this.code[line] = fn.apply(this, args);
};

Code.prototype.getLineChrDiff = function (r) {
  var tabs;
  var lineNo = r.line;

  tabs = this.code[lineNo].split("\t");

  return this.code[lineNo].length - ((tabs ? tabs.length : 0) - 1);
};

Code.prototype.toString = function () {
  return this.code.join("\n");
};

module.exports = Code;
