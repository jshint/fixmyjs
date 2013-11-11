(function () {
// Global object.
  var exports = this;

// Code Object
// This object is what manipulates the code that's passed
// to be fixed.
  var Code = function (src) {
    this.src = src.split('\n');
    this._src = this.src.slice(0);
  };

// Retrieves the code that was stored in the Object
//
// returns String
  Code.prototype.getCode = function () {
    return this.src.join('\n');
  };

// The fix method fixes a certain line in the code.
//
// **fn** is the function which will be responsible for modifying the line
// **o** is the JSHint object related to the error we're fixing
//
// returns the fixed line as a String
  Code.prototype.fix = function (fn, o) {
    var line = o.line;
    var result = fn.call(fn, this.src[line], o, this);
    this.src.splice.apply(this.src, [line, 1].concat(result.split('\n')));
    return result;
  };

// This function keeps track of character changes.
// As the code is modified via additions/deletions
// the character positioning reported by JSHint is no
// longer 100% accurate. This function will return the
// position where the intended character is at.
//
// **r** is the JSHint object related to the error
//
// returns Number
//
// Tabs are special, they count as two characters in text
// and as one character by the JSHint parser.
// If there are tabs then indentation is important, we'll need to know
// how many characters each tab is supposed to be worth.
  Code.prototype.getChr = function (r) {
    var lineNo = r.line;
    var tabs = this.src[lineNo].split('\t');

    return r.character - ((tabs.length - 1) * (r.config.indent - 1)) - 1;
  };


// Fix Object
// Contains all the methods that fix the various errors
  var fix = (function () {

// These are helpers that a few of the errors share in common
    var helpers = {

// Inserts a string within a string at a certain offset.
//
// **str** is the initial string
// **offset** is a number where we'll be inserting
// **newstr** is the string that will be inserted
//
// returns the modified String
      insertIntoString: function (str, offset, newstr) {
        var part1 = str.substr(0, offset);
        var part2 = str.substr(offset);

        return part1 + newstr + part2;
      },

      replaceBetween: function (str, offset, fn) {
        var part1 = str.substr(0, offset);
        var part2 = str.substr(offset);

        return part1 + fn(part2);
      },

// Removes a certain character from the string
//
// **str** is the string
// **pos** is the position in the string we'll be removing
//
// returns the modified String
      rmFromString: function (str, pos) {
        return str.slice(0, pos) +
          ''.substr(0, 1) +
          ''.slice(1) +
          str.slice(pos + 1);
      }
    };

// The following are the methods that make the fixes.
// Each method is responsible for fixing one error.
//
// All methods have the same parameters
// **str** is the string to fix
// **o** is the JSHint object which holds the error information
// **code** is the current Code object
//
// returns String
    var Fix = {

// Adds a semicolon at the position specified by JSHint.
//
// For those that prefer to end their statements with
// a semicolon fixmyjs will automatically insert a semicolon
// wherever one is thought to be missing.
//
// Example:
//
// `var foo = 1` -> `var foo = 1;`
      addSemicolon: function (str, o, code) {
        var chr = code.getChr(o);
        // Protect against JSHINT bug:
        // https://github.com/jshint/jshint/issues/387
        var offset = chr - 6;
        if (offset > -1 && str.substr(offset, chr) === 'delete') {
          return str;
        }
        return helpers.insertIntoString(str, chr, ';');
      },

// Adds a space at the position specified by JSHint.
//
// Related to the `white` option in JSHint. It is
// meant for beautifying code and adds spaces where
// spaces are supposed to be according to certain
// authorities of the language.
//
// Example:
//
// `var a = function(){}` -> `var a = function () {}`
      addSpace: function (str, o, code) {
        var chr = code.getChr(o);
        if (chr < str.length) {
          return helpers.insertIntoString(str, chr, ' ');
        }

        return str;
      },

// Converts assignments from Object to Literal form.
//+ arrayLiteral :: String -> String
// FIXME r10 JSHINT
      arrayLiteral: function (str) {
        return str.replace(/new Array(\(\))?(?!.*new Array(\(\))?)/, '[]');
      },

// Converts from square bracket notation to dot notation.
//
// Example:
//
// `person['name']` -> `person.name`
// FIXME r10 JSHINT
      dotNotation: function (str, o) {
        var dot = o.a;
        var rx = new RegExp('\\[[\'"]' +
          dot + '[\'"]\\]?(?!.*\\[[\'"]' +
          dot + '[\'"]\\]?)');

        return str.replace(rx, function () {
          return '.' + dot;
        });
      },

// Immediate functions are executed within the parenthesis.
//
// By wrapping immediate functions in parenthesis you indicate
// that the expression is the result of a function and not the
// function itself.
//+ immed :: String -> String
// XXX
      immed: function (str) {
        var rx = /\)\((.*)\);/;
        var params;

        if (rx.test(str)) {
          params = rx.exec(str);
          str = str.replace(params[0], '(' + params[1] + '));');
        }

        return str;
      },

// Auto-indents. Based on your preferences of `spaces`
// or `tabs`.
//
// fixmyjs will not automatically indent your code unless
// you have the `indentpref` option set to your preference
// and `auto_indent` is set to true in your `.jshintrc` file.
//
// You may also want to configure the `indent` option to the
// desired amount of characters you wish to indent. The default
// set by JSHint is four.
      indent: function (str, o, code) {
        var indent = o.b;
        var found = code.getChr(o);
        var config = o.config;
        var tabs;
        var whitespace;
        var cutstr;
        if (config.auto_indent === true && config.indentpref) {
          switch (config.indentpref) {
          case 'spaces':
            whitespace = new Array(indent).join(' ');
            break;
          case 'tabs':
            tabs = (indent + 1) / config.indent;
            if (tabs > 0) {
              whitespace = new Array(tabs).join('\t');
            }
            break;
          }

          cutstr = str.slice(0, found);

          // if the whitespace 'fix' should be on a newline
          if (found > 1 && !/^[\s]+$/.test(cutstr)) {
            // mutates the line count
            return cutstr.replace(/\s+$/, '') +
              '\n' + whitespace +
              str.slice(found).trim();
          }

          str = whitespace + str.trim();
        }

        return str;
      },

// Adds parens to constructors missing them during invocation.
//+ invokeConstructor :: String -> String
      invokeConstructor: function (str, o, code) {
        var chr = code.getChr(o);
        var rx = new RegExp('^' + o.a);

        return helpers.replaceBetween(str, chr, function (rest) {
          return rest.replace(rx, function (a) {
            return a + '()';
          });
        });
      },

// Adds a zero when there is a leading decimal.
//
// A leading decimal can be confusing if there isn't a
// zero in front of it since the dot is used for calling
// methods of an object. Plus it's easy to miss the dot.
//
// Example:
//
// `.5` -> `0.5`
//+ leadingDecimal :: String -> String
      leadingDecimal: function (str, o) {
        return str.replace(/([\D] *)\.([\d]+)/g, function (a, b, c) {
          if (o.a === c) {
            return b + '0.' + c;
          }
          return a;
        });
      },

// Removes spaces or tabs (depending on preference) when
// both are present on the same line.
      mixedSpacesNTabs: function (str, o) {
        var config = o.config;
        var spaces;
        if (config.indentpref) {
          spaces = new Array(config.indent + 1).join(' ');

          if (config.indentpref === 'spaces') {
            str = str.replace(/\t/g, spaces);
          } else if (config.indentpref === 'tabs') {
            str = str.replace(new RegExp(spaces, 'g'), '\t');
          }
        }

        return str;
      },

// You shouldn't delete vars. This will remove the delete statement
// and instead set the variable to undefined.
//
// Example: `delete foo;` -> `foo = undefined;`
//+ noDeleteVar :: String -> String
// XXX
      noDeleteVar: function (str) {
        var rx = /delete ([\w$_]+)(?!.*delete [\w$_]+)/;
        return str.replace(rx, function (a, b) {
          return b + ' = undefined';
        });
      },

// Removes `new` when it's used as a statement.
// Only works if option `nonew` is set to true.
//
// Example: `new Ajax()` -> `Ajax()`
//+ noNew :: String -> String
// FIXME r10 JSHINT
      noNew: function (str) {
        var rx = /new ([\w$_]+)(?!.*new [\w$_]+)/;
        return str.replace(rx, function (a, b) {
          return b;
        });
      },

// Converts assignments from Object to Literal form.
//+ objectLiteral :: String -> String
// XXX
      objectLiteral: function (str) {
        return str.replace(/new Object(\(\))?(?!.*new Object(\(\))?)/, '{}');
      },

// Removes `new` when attempting to use a function not meant to
// be a constructor.
//
// Uses RegEx to determine where the error occurs. If there's a match
// then we extract the 1st and 2nd value of the result of the RegExp
// execution, and use them in String replace.
//
// Example: `new Number(16)` -> `Number(16)`
//+ objNoConstruct :: String -> String
// FIXME r10 JSHINT
      objNoConstruct: function (str) {
        var rx = /new (Number|String|Boolean|Math|JSON)/;
        var exec;
        if (rx.test(str)) {
          exec = rx.exec(str);
          str = str.replace(exec[0], exec[1]);
        }
        return str;
      },

// Uses isNaN function rather than comparing to NaN.
//
// It's the same reason you shouldn't compare with undefined.
// NaN can be redefined. Although comparing to NaN is faster
// than using the isNaN function.
//+ useIsNaN :: String -> String
// XXX
      useIsNaN: function (str) {
        var rx = /([a-zA-Z_$][0-9a-zA-Z_$]*)( )*(=|!)(=|==)( )*NaN/;
        var exec;

        if (rx.test(str)) {
          exec = rx.exec(str);

          if (exec) {
            str = str.replace(
              exec[0],
              (exec[3] === '!' ? '!': '') + 'isNaN(' + exec[1] + ')'
            );
          }
        }

        return str;
      },

// Adds radix parameter to parseInt statements.
//
// Although this parameter is optional, it's good practice
// to add it so that the function won't assume the number is
// octal.
//
// In the example below we have a sample Credit Card security
// code which is padded by a zero. By adding the radix parameter
// we are telling the compiler the base of the number is being
// passed.
//
// Example:
//
// `parseInt('0420')` -> `parseInt('0420', 10)`
//+ radix :: String -> String
// FIXME r10 JSHINT
      radix: function (str) {
        var rx = /parseInt\(([^,\)\(]+)\)/;
        var offset = 0;
        var exec;

        while ((exec = rx.exec(str.substr(offset))) !== null) {
          var limit = exec.index + exec[0].length;
          var newCode = 'parseInt(' + exec[1] + ', 10)';
          var result = str.substr(0, exec.index + offset)
                        + newCode
                        + str.substr(limit + offset);
          str = result;
          offset = exec.index + offset + newCode.length;
        }
        return str;
      },

// Removes a Character from the String
      rmChar: function (str, o, code) {
        var chr = code.getChr(o);
        return helpers.rmFromString(str, chr);
      },

// Removes debugger statements.
//
// Debugger statements can be useful for debugging
// but some browsers don't support them so they shouldn't
// be in production.
//+ rmDebugger :: String
      rmDebugger: function () {
        return '';
      },

// Removes undefined when variables are initialized to it.
//
// It's not necessary to initialize variables to undefined since
// they are already initialized to undefined by declaring them.
//
// Example:
//
// `var foo = undefined;` -> `var foo;`
//+ rmUndefined :: String -> String
      rmUndefined: function (str, o) {
        return str.replace(/([^ ]*) *= *undefined */g, function (orig, name) {
          return name === o.a ? name : orig;
        });
      },

// Removes any whitespace at the end of the line.
// Trailing whitespace sucks. It must die.
//+ rmTrailingWhitespace :: String -> String
      rmTrailingWhitespace: function (str) {
        return str.replace(/\s+$/g, '');
      },

// Throws an error that too many errors were reported by JSHint.
// JSHint has a maximum amount of errors it can handle before it barfs.
// If we encounter this, we just throw and recommend that the applications
// that use `fixmyjs` catch the error and either retry to fix the file or
// ask the user what they would like to do.
//
// NOTE: In cases where there are many errors in the file the `TME` error
// may be encountered and none of the errors reported are supported by fixmyjs
// see: GH-31
      tme: function () {
        throw new Error('Too many errors reported by JSHint.');
      },

// Removes a trailing decimal where it's not necessary.
//
// Example:
//
// `12.` -> `12`
//+ trailingDecimal :: String -> String
      trailingDecimal: function (str, o) {
        return str.replace(/([\d]+)\./g, function (a, b) {
          if (b + '.' === o.a) {
            return b;
          }
          return a;
        });
      },

// Wraps RegularExpression literals in parenthesis to
// disambiguate the slash operator.
//
// Example: `return /hello/;` -> `return (/hello/);`
//+ wrapRegExp :: String -> String
      wrapRegExp: function (str) {
        var rx = /\/(.*)\/\w?/;
        var result;

        if (rx.test(str)) {
          result = rx.exec(str);
          str = str.replace(rx, '(' + result[0] + ')');
        }

        return str;
      }
    };

    return Fix;
  }());


  // All errors supported by fixmyjs.
  var errors = {
    'E043': fix.tme,
    'W008': fix.leadingDecimal,
    'W009': fix.arrayLiteral,
    'W010': fix.objectLiteral,
    'W011': fix.rmChar,
    'W013': fix.addSpace,
    'W015': fix.indent,
    'W019': fix.useIsNaN,
    'W031': fix.noNew,
    'W032': fix.rmChar,
    'W033': fix.addSemicolon,
    'W047': fix.trailingDecimal,
    'W051': fix.noDeleteVar,
    'W053': fix.objNoConstruct,
    'W058': fix.invokeConstructor,
    'W062': fix.immed,
    'W065': fix.radix,
    'W069': fix.dotNotation,
    'W070': fix.rmChar,
    'W080': fix.rmUndefined,
    'W087': fix.rmDebugger,
    'W092': fix.wrapRegExp,
    'W099': fix.mixedSpacesNTabs,
    'W102': fix.rmTrailingWhitespace
  };

  // Give each error a function which will call the proper fix function
  Object.keys(errors).forEach(function (key) {
    var fn = errors[key];
    errors[key] = function (r, code) {
      return code.fix(fn, r);
    };
  });


// fixMyJS is part of the global object
  exports.fixMyJS = (function () {
// Copies over the results into one of our own objects
// we decrement r.line by one becuse Arrays start at 0.
// and we pass the config object to r.
    function copyResults(result, config) {
      var r = {};
      Object.keys(result).forEach(function (key) {
        r[key] = result[key];
      });
      r.line -= 1;
      r.config = config;
      return r;
    }

// Calls the function responsible for fixing the error passed.
    function fixError(r, code) {
      return errors[r.code](r, code);
    }

// Function used in forEach which fixes all errors passed
// **code** is the Code object
// **config** is the config object
// returns a function which when iterated it copies over the results
// so we can mutate data later and then call fixError.
    function fixErrors(code, config) {
      return function (result) {
        var r = copyResults(result, config);
        fixError(r, code);
      };
    }

// Used by fixMyJS function in order to sort the
// errors so we can fix the code bottom-up and right-left
    function byPriority(a, b) {
      if (a.line === b.line) {
        return b.character - a.character;
      }

      return b.line - a.line;
    }

// The fixMyJS function is what's returned to the
// global object.
//
// **data** is the data from jshint.data()
// **src** is the original src passed to JSHint
//
// returns an Object containing the API
    function fixMyJS(data, src, options) {
      var code = new Code(src);
      var warnings = data.errors || [];
      var results = [];
      var config = data.options || {};
      var current = 0;

// merge custom options into config
      if (options) {
        Object.keys(options).forEach(function (option) {
          config[option] = options[option];
        });
      }

      function resetResults() {
        var dupes = {};
// Filter out errors we don't support.
// If the error is null then we immediately return false
// Then we check for duplicate errors. Sometimes JSHint will complain
// about the same thing twice. This is a safeguard.
// Otherwise we return true if we support this error.
        results = warnings.filter(function (v) {
          if (!v) {
            return false;
          }

          var err = 'line' + v.line +
                    'char' + v.character +
                    'reason' + v.reason;

          if (dupes.hasOwnProperty(err)) {
            return false;
          }
          dupes[err] = v;

          if (v.hasOwnProperty('fixable')) {
            return v.fixable;
          }

          return (v.fixable = errors.hasOwnProperty(v.code));
        });

// sorts errors by priority.
        results.sort(byPriority);
      }

      resetResults();


// fixMyJS API
//
// * getErrors
// * getAllErrors
// * getCode
// * next
//   * fix
//   * getDetails
// * run
      var api = {
// returns are supported errors that can be fixed.
        getErrors: function () {
          return results.slice(0);
        },

        getAllErrors: function () {
          return warnings.slice(0);
        },

// returns the current state of the code.
        getCode: function () {
          return code.getCode();
        },

// Iterator method. Returns Boolean if there is a next item
//
// Example:
// while (af.hasNext()) {
//   var a = af.next();
// }
        hasNext: function () {
          return (current < results.length);
        },

// Iterator method. Iterates through each error in the
// Array and returns an Object with fix and getDetails methods.
// if the end of the Array is reached then an error is thrown.
//
// fix function will fix the current error and return the state of the code.
// getDetails will return a prototype of the current error's details
        next: function () {
          if (!this.hasNext()) {
            throw new Error('End of list.');
          }

          var r = copyResults(results[current], config);
          var data = {
            fix: function () {
              fixError(r, code);
              return code.getCode();
            },
            fixVerbose: function () {
              return {
                original: code._src[r.line],
                replacement: fixError(r, code)
              };
            },
            getDetails: function () {
              return Object.create(r);
            }
          };
          current += 1;
          return data;
        },

        filterErrors: function (fn) {
          warnings = warnings.map(function (w) {
            w.fixable = fn(w);
            return w;
          });
          resetResults();
          return warnings.slice(0);
        },

// runs through all errors and fixes them.
// returns the fixed code.
//
// **returnErrors** Boolean - true if you'd like an Array of all errors
// with the proposed fix.
//
// returns the code String || an Array of JSHint errors.
        run: function (returnErrors) {
          if (returnErrors) {
            return warnings
              .slice(0)
              .sort(byPriority)
              .map(function (v) {
                v.fixable && (v.fix = fixError(copyResults(v, config), code));
                return v;
              });
          } else {
            results.forEach(fixErrors(code, config));
            return code.getCode();
          }
        },

        runVerbose: function () {
          var lint = [];
          var dup = {};
          var next;
          while (api.hasNext()) {
            next = api.next();
            lint.push(copyResults(next.fixVerbose(), next.getDetails()));
          }
          return lint.reverse().filter(function (x) {
            if (dup.hasOwnProperty(x.original)) {
              return false;
            }
            x.line = x.config.line;
            dup[x.original] = x;
            return true;
          });
        }
      };

      return api;
    }

    return fixMyJS;
  }());

  exports.fixMyJS.legacyVersion = '0.6.9';

// for node.js
// if module is available, we export to it.
  if (typeof module !== 'undefined') {
    module.exports = exports.fixMyJS;
  }

}.call(this));
