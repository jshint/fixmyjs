/*global module */

var helpers = {
  insertIntoString: function (str, offset, newstr) {
    var part1 = str.substr(0, offset);
    var part2 = str.substr(offset);

    return part1 + newstr + part2;
  }
};

var Fix = {
  addSpace: function (str, chr) {
    return helpers.insertIntoString(str, chr, " ");
  },
  addSemicolon: function (str, chr) {
    return helpers.insertIntoString(str, chr, ";");
  }
};

module.exports = Fix;
