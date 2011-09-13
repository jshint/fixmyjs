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
  anonFuncInvocation: function (str) {
    return str.replace("})()", "}())");
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
    var rx = /new ([a-zA-Z_$][0-9a-zA-Z_$]*)/;

    if (rx.test(code)) {
      result = rx.exec(code).shift();
      str = str.replace(rx, result + "()");
    }

    return str;
  },
  leadingDecimal: function (str) {
    var rx = /\.([0-9]*)/;
    var result;

    if (rx.test(str)) {
      result = rx.exec(str).shift();
      str = str.replace(rx, "0" + result);
    }

    return str;
  },
  lineBrk: function (str, o, n) {
    str = this.lines[o] + " " + this.lines[n].trim();
    this.lines[n] = "";
    return str;
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
  useIsNaN: function (str) {
    var rx = /([a-zA-Z_$][0-9a-zA-Z_$]*)( )*(=|!)(=|==)( )*NaN/;
    var exec;

    if (rx.test(str)) {
      exec = rx.exec(str);

      if (exec) {
        str = str.replace(exec[0], (exec[3] === "!" ? "!": "") + "isNaN(" + exec[1] + ")");
      }
    }

    return str;
  },
  rmChar: function (str, chr) {
    return helpers.rmFromString(str, chr);
  },
  rmDebugger: function () {
    return "";
  },
  rmUndefined: function (str) {
    return str.replace(/( )*=( )*undefined/, "");
  },
  trailingDecimal: function (str) {
    var rx = /([0-9]*)\./;
    var result;

    if (rx.test(str)) {
      result = rx.exec(str)[1];
      str = str.replace(rx, result);
    }

    return str;
  }
};

module.exports = Fix;
