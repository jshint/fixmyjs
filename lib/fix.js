/*global module */

var helpers = {
  insertIntoString: function (str, offset, newstr) {
    var part1 = str.substr(0, offset);
    var part2 = str.substr(offset);

    return part1 + newstr + part2;
  }
};

var Fix = {
  addSemicolon: function (str, chr) {
    return helpers.insertIntoString(str, chr, ";");
  },
  addSpace: function (str, chr) {
    return helpers.insertIntoString(str, chr, " ");
  },
  alreadyDefined: function (str) {
    return str.replace("var ", "");
  }
};

module.exports = Fix;
