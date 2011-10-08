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
  alreadyDefined: function (str, a) {
    var rx = new RegExp("(.*)(var " + a + ")");
    var exec = "",
        incorrect = "",
        replacement = "";

    if (rx.test(str)) {
      exec = rx.exec(str);
      incorrect = str.replace(exec[1], "");
      replacement = incorrect.replace(exec[2], a);
    }

    return str.replace(incorrect, replacement);
  },
  anonFuncInvocation: function (str) {
    return str.replace("})()", "}())");
  },
  arrayLiteral: function (str) {
    return str.replace("new Array()", "[]");
  },
  dotNotation: function (str, dot) {
    var rx = new RegExp("\\[[\"']" + dot + "[\"']\\]");
    var sqbNotation;

    if (rx.test(str)) {
      sqbNotation = rx.exec(str);
      str = str.replace(sqbNotation[0], "." + dot);
    }

    return str;
  },
  indent: function (str, indent, config) {
    if (config.auto_indent === true) {
      str = new Array(indent).join(" ") + str.trim();
    }

    return str;
  },
  invokeConstructor: function (str) {
    var rx = /new [a-zA-Z_$][0-9a-zA-Z_$]*\(/g;
    var result = str;

    function addInvocation(tmp) {
      var rx = /new ([a-zA-Z_$][0-9a-zA-Z_$]*)/;
      var res;

      if (rx.test(tmp)) {
        res = rx.exec(tmp).shift();
        str = str.replace(res, res + "()");
      }

      return str;
    }

    if (rx.test(str)) {
      result = str.replace(rx, "");
    }

    return addInvocation(result);
  },
  leadingDecimal: function (str) {
    var rx = /([\D])(\.[0-9]*)/;

    var result;

    if (rx.test(str)) {
      result = rx.exec(str);
      str = str.replace(rx, result[1] + "0" + result[2]);
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
      str = str.replace(/\t/g, new Array(config.indent + 1).join(" "));
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
    var rx = /([0-9]*)\.(\D)/;
    var result;

    if (rx.test(str)) {
      result = rx.exec(str);
      str = str.replace(rx, result[1] + result[2]);
    }

    return str;
  }
};

module.exports = Fix;
