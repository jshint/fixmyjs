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


## Legacy Mode

fixmyjs supports a `legacy` mode which can be used via the CLI and programatically.

### CLI

```
fixmyjs --legacy your_file.js
```

### Programatically

```js
var jshint = require('jshint').JSHINT
var fixmyjs = require('fixmyjs')
jshint(stringOfCode, objectOfOptions)
var stringFixedCode = fixmyjs(jshint.data(), stringOfCode, objectOfOptions).run()
```

Legacy uses [JSHINT](https://github.com/jshint/jshint) to determine what needs to be fixed and then uses a combination of regular expressions and string replacements to non-destructively fix any errors. While non-legacy supports more options, it is more prone to being destructive since the JavaScript is rewritten by the program.

### Why is it legacy?

We're planning on moving away from code string transformations and into transforming the AST directly because these rules are easier to write, maintain, and offers flexibility in terms of what can be supported. `2.0` release will have fixmyjs using [recast](https://github.com/benjamn/recast) which will make fixmyjs more performant and less destructive, [esformatter](https://github.com/millermedeiros/esformatter) will also be included to perform any style changes.


## License

[MIT](https://github.com/jshint/fixmyjs/blob/master/LICENSE)
