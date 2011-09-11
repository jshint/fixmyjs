/*global module */

var helpers = {
  insertIntoString: function (str, offset, newstr) {
    var part1 = str.substr(0, offset);
    var part2 = str.substr(offset);

    return part1 + newstr + part2;
  },

  rmFromString: function (str, pos) {
    return str.slice(0, pos) + "".substr(0, 1) + "".slice(1) + str.slice(pos + 1);
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
  },
  arrayLiteral: function (str) {
    return str.replace("new Array()", "[]");
  },
  dotNotation: function (str) {
    var rx = {
      sqb: /\[["'][a-zA-Z_$][0-9a-zA-Z_$]*["']\]/,
      dot: /[a-zA-Z_$][0-9a-zA-Z_$]*/
    };

    var sqbNotation, dotNotation;

    if (rx.sqb.test(str)) {
      sqbNotation = rx.sqb.exec(str);
      dotNotation = rx.dot.exec(sqbNotation[0]);

      str = str.replace(sqbNotation[0], "." + dotNotation[0]);
    }

    return str;
  },
  indent: function (str, indent, config) {
    if (config.auto_indent === true) {
      str = new Array(indent).join(" ") + str.trim();
    }

    return str;
  },
  invokeConstructor: function (str, chr) {
    return helpers.insertIntoString(str, chr, "()");
  },
  leadingDecimal: function (str, chr) {
    return helpers.insertIntoString(str, chr, "0");
  },
  mixedSpacesNTabs: function (str, config) {
    if (config.auto_indent === true) {
      str = str.replace("\t", new Array(config.indent).join(" "));
    }

    return str;
  },
  objectLiteral: function (str) {
    return str.replace("new Object()", "{}");
  },
  rmChar: function (str, chr) {
    return helpers.rmFromString(str, chr);
  }
};

module.exports = Fix;
