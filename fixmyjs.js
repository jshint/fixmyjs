(function () {
  var exports = this;

  var Code = function (src) {
    this.src = src.split("\n");
  };

  Code.prototype.getCode = function () {
    return this.src.join("\n");
  };

  Code.prototype.fix = function (fn, line) {
    var args = Array.prototype.slice.call(arguments, 2);

    if (!this.src) {
      this.readCode();
    }

    args.unshift(this.src[line]);

    this.src[line] = fn.apply(this, args);
  };

  Code.prototype.getChr = function (r) {
    var tabs;
    var lineNo = r.line;

    if (!this.src) {
      this.readCode();
    }

    tabs = this.src[lineNo].split("\t");

    return r.character - tabs.length;
  };


  var fix = (function () {
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
        str = this.src[o] + " " + this.src[n].trim();
        this.src[n] = "";
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

    return Fix;
  }());


  var errors = {
    "'{a}' is already defined.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.alreadyDefined, r.line, r.a);
      }
    },

    "['{a}'] is better written in dot notation.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.dotNotation, r.line, r.a);
      }
    },

    "A leading decimal point can be confused with a dot: '.{a}'.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.leadingDecimal, r.line);
      }
    },

    "A trailing decimal point can be confused with a dot '{a}'.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.trailingDecimal, r.line);
      }
    },

    "All 'debugger' statements should be removed.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.rmDebugger, r.line);
      }
    },

    "Expected '{a}' to have an indentation at {b} instead at {c}.": {
      priority: 1,
      fix: function (r, code) {
    //    code.fix(fix.indent, r.line, r.b, r.config);
      }
    },

    "It is not necessary to initialize '{a}' to 'undefined'.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.rmUndefined, r.line);
      }
    },

    "Line breaking error '{a}'.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.lineBrk, r.line, r.line, (r.line + 1));
      }
    },

    "Missing '()' invoking a constructor.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.invokeConstructor, r.line);
      }
    },

    "Missing semicolon.": {
      priority: 0,
      fix: function (r, code) {
        code.fix(fix.addSemicolon, r.line, code.getChr(r));
      }
    },

    "Missing space after '{a}'.": {
      priority: 0,
      fix: function (r, code) {
        code.fix(fix.addSpace, r.line, code.getChr(r));
      }
    },

    "Mixed spaces and tabs.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.mixedSpacesNTabs, r.line, r.config);
      }
    },

    "Move the invocation into the parens that contain the function.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.anonFuncInvocation, r.line);
      }
    },

    "Too many errors.": {
      priority: 2,
      fix: function () {
      }
    },

    "Unexpected space after '{a}'.": {
      priority: 0,
      fix: function (r, code) {
        code.fix(fix.rmChar, r.line, code.getChr(r));
      }
    },

    "Unnecessary semicolon.": {
      priority: 0,
      fix: function (r, code) {
        code.fix(fix.rmChar, r.line, code.getChr(r));
      }
    },

    "Use the isNaN function to compare with NaN.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.useIsNaN, r.line);
      }
    },

    "Use the array literal notation [].": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.arrayLiteral, r.line);
      }
    },

    "Use the object literal notation {}.": {
      priority: 1,
      fix: function (r, code) {
        code.fix(fix.objectLiteral, r.line);
      }
    }
  };

  exports.fixMyJS = (function () {
    // copies over the results into one of our own objects
    function copyResults(result, config) {
      var r = {};

      // copy over
      Object.keys(result).forEach(function (key) {
        r[key] = result[key];
      });

      // because Array's start at 0.
      r.line -= 1;

      // pass the user config along with it
      r.config = config;

      return r;
    }

    // checks if this error is fixable, and fixes it
    function fixError(r, code) {
      // call fix function
      if (errors.hasOwnProperty(r.raw)) {
        errors[r.raw].fix(r, code);
      }
    }

    function fixErrors(code, config) {
      return function (result) {
        var r = copyResults(result, config);
        fixError(r, code);
      };
    }

    function byPriority(a, b) {
      var p1 = errors[a.raw].priority;
      var p2 = errors[b.raw].priority;

      if (p1 === p2) {
        if (a.line === b.line) {
          return b.character - a.character;
        } else {
          return b.line - a.line;
        }
      } else {
        return p1 - p2;
      }
    }

    function fixMyJS(data, src) {
      var code = new Code(src);
      var results = data.errors;
      var config = data.options;

      // filter out errors we don't support.
      results = results.filter(function (v) {
        return v && errors.hasOwnProperty(v.raw);
      });

      // sort errors.
      results.sort(byPriority);

      // fix them.
      results.forEach(fixErrors(code, config));

      return code.getCode();
    }

    return fixMyJS;
  }());

  if (typeof module !== "undefined") {
    module.exports = exports.fixMyJS;
  }

}.call(this));

