# [fixmyjs](https://fixmyjs.com)

[![Join the chat at https://gitter.im/jshint/fixmyjs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jshint/fixmyjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Meant to automatically fix your JavaScript errors in a non-destructive way.

[![Build Status](https://secure.travis-ci.org/jshint/fixmyjs.svg)](http://travis-ci.org/jshint/fixmyjs)
[![Coverage Status](https://img.shields.io/coveralls/jshint/fixmyjs.svg?style=flat)](https://coveralls.io/r/jshint/fixmyjs)
[![NPM version](https://badge.fury.io/js/fixmyjs.svg)](http://badge.fury.io/js/fixmyjs)
[![Dependency Status](https://david-dm.org/jshint/fixmyjs.svg)](https://david-dm.org/jshint/fixmyjs)
[![devDependency Status](https://david-dm.org/jshint/fixmyjs/dev-status.svg)](https://david-dm.org/jshint/fixmyjs#info=devDependencies)
[![Download Count](https://img.shields.io/npm/dm/fixmyjs.svg?style=flat)](https://www.npmjs.com/package/fixmyjs)

## Installing

```
npm install fixmyjs -g
```

## Usage

```
fixmyjs your_file.js
```

### Programatically

```js
var fixmyjs = require('fixmyjs')
var stringFixedCode = fixmyjs.fix(stringOfCode, objectOfOptions)
```


## Tools

- [Atom plugin](https://github.com/sindresorhus/atom-fixmyjs)
- [Brackets plugin](https://github.com/fyockm/brackets-fixmyjs)
- [Gulp plugin](https://github.com/kirjs/gulp-fixmyjs)
- [Grunt plugin](https://github.com/jonschlinkert/grunt-fixmyjs)
- [Sublime plugin](https://github.com/addyosmani/sublime-fixmyjs)
- [fixmyjs.com](http://fixmyjs.com)


## Options

When the options are set to true they are enabled. To get a breakdown of what is enabled by default check out [package.json](https://github.com/jshint/fixmyjs/blob/v2.0/package.json#L62)

* `camelcase` - Converts all identifiers to camelCase
* `curly` - Adds curly braces to all statements that don't have them
* `curlyfor` - Adds curly braces only to for statements
* `curlyif` - Adds curly braces only to if/if-else statements
* `curlywhile` - Adds curly braces only to while statements
* `debug` - Removes debugger statements
* `decimals` - Adds a leading `0` for decimals or removes trailing zero if decimal is whole
* `delete` - Removes deletion of variables
* `emptyStatement` - Removes empty statements
* `eqeqeq` - Enforce strict equality
* `es3` - Enforces `parseIntRadix` as well as `no-comma-dangle`
* `hoist` - Hoists all your vars to the top of the function
* `initUndefined` - Rewrites variable initializations to undefined
* `invalidConstructor` - Does not allow you to initialize built-in primitive constructors
* `invokeConstructors` - Adds `()` to any new expressions
* `isNan` - Replaces equality to NaN with isNaN
* `multivar` - Replace single var with multi line var
* `no-comma-dangle` - Removes trailing commas
* `nonew` - Removes new when using it for side effects
* `onevar` - Make multi var into one var
* `parseIntRadix` - Adds a radix parameter to parseInt
* `plusplus` - Converts `++` and `--` to `+= 1` || `-= 1`
* `rmdelete` - Removes the deletion of variables
* `rmempty` - Removes empty statements
* `snakecase` - Convert all identifiers to snake_case
* `sub` - Dot notation conversion
* `useLiteral` - Rewrites your primitives to use their literal form


## Breaking Changes in 2.0

* Legacy mode has been removed.
* You now put your config inside package.json. You can check out an [example in this project](https://github.com/jshint/fixmyjs/blob/v2.0/package.json#L62).
* All rules have been made truthy because having some rules be truthy and others falsy is weird.
* Option `es3` now enables `no-comma-dangle` as well as new option `parseIntRadix`.


## License

[MIT](https://github.com/jshint/fixmyjs/blob/master/LICENSE)
