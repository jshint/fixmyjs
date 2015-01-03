# [fixmyjs](https://fixmyjs.com)

> Meant to automatically fix your JavaScript errors in a non-destructive way.

[![Build Status](https://secure.travis-ci.org/jshint/fixmyjs.svg)](http://travis-ci.org/jshint/fixmyjs)
[![Coverage Status](https://img.shields.io/coveralls/jshint/fixmyjs.svg)](https://coveralls.io/r/jshint/fixmyjs)
[![NPM version](https://badge.fury.io/js/fixmyjs.svg)](http://badge.fury.io/js/fixmyjs)
[![Dependency Status](https://david-dm.org/jshint/fixmyjs.svg)](https://david-dm.org/jshint/fixmyjs)
[![devDependency Status](https://david-dm.org/jshint/fixmyjs/dev-status.svg)](https://david-dm.org/jshint/fixmyjs#info=devDependencies)

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

These options are mostly named after their JSHINT counterparts.

### Built in

* `delete` - Removes deletion of variables
* `emptyStatement` - Removes empty statements
* `initUndefined` - Rewrites variable initializations to undefined
* `invalidConstructor` - Does not allow you to initialize built-in primitive constructors
* `isNaN` - Replaces equality to NaN with isNaN
* `useLiteral` - Rewrites your primitives to use their literal form

### Truthy

When these are set to true the options apply.

* `camelcase` - Converts all identifiers to camelCase
* `curly` - Adds curly braces to all statements that don't have them
* `es3` - Adds a radix parameter to parseInt
* `nonew` - Removes new when using it for side effects
* `snakecase` - Convert all identifiers to snake_case
* `multivar` - Replace single var with multi line var
* `plusplus` - Converts `++` and `--` to `+= 1` || `-= 1`
* `eqeqeq` - Enforce strict equality

### Falsy

When these are set to false the options apply.

* `debug` - Removes debugger statements
* `sub` - Dot notation conversion


## Upcoming Breaking Changes in 2.0

* Legacy mode has been removed.
* You now put your config inside package.json. You can check out an [example in this project](https://github.com/jshint/fixmyjs/blob/v2.0/package.json#L62).
* All rules have been made truthy because having some rules be truthy and others falsy is weird.
* Option `es3` has been renamed to `parseIntRadix` because that is all the es3 option.


## License

[MIT](https://github.com/jshint/fixmyjs/blob/master/LICENSE)
