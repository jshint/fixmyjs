var Code = function (str) {
  this.code = str;
};

Code.prototype.fix = function (fn, line) {
  var args = Array.prototype.slice.call(arguments, 2);

  args.unshift(this.getLine(line));

  this.code = fn.apply(this, args);
};

Code.prototype.getLine = function (lineNo) {
  return this.code.split("\n")[lineNo];
};

Code.prototype.toString = function () {
  return this.code;
};

module.exports = Code;
