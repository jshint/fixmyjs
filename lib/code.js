var Code = function (str) {
  this.code = str;
};

Code.prototype.fix = function (fn, code) {
  var args = Array.prototype.slice.call(arguments, 2);

  args.unshift(code);

  this.code = fn.apply(this, args);
};

module.exports = Code;
