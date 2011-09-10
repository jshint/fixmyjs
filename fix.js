/*global module */

var Fix = {
  addSemicolon: function (str, chr) {
    var part1 = str.substr(0, chr);
    var part2 = str.substr(chr);

    return part1 + ";" + part2;
  }
};

module.exports = Fix;
