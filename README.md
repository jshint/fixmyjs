# fixmyjs || jshint-autofix

[![Build Status](https://secure.travis-ci.org/jshint/fixmyjs.png)](http://travis-ci.org/jshint/fixmyjs)
[![NPM version](https://badge.fury.io/js/fixmyjs.png)](http://badge.fury.io/js/fixmyjs)
[![Dependency Status](https://david-dm.org/jshint/fixmyjs.png)](https://david-dm.org/jshint/fixmyjs)
[![devDependency Status](https://david-dm.org/jshint/fixmyjs/dev-status.png)](https://david-dm.org/jshint/fixmyjs#info=devDependencies)

Meant to automatically fix your lint errors in a non-destructive way.

For the website see <https://github.com/goatslacker/fixmyjs.com>.

## How to Install CLI

```
npm install fixmyjs -g
```

## Usage

```
fixmyjs your_file.js
```

or from node.js

```js
var fixmyjs = require('fixmyjs')
var stringFixedCode = fixmyjs.fix(stringOfCode, objectOfOptions)
```

node.js legacy:

```js
var jshint = require('jshint').JSHINT
var fixmyjs = require('fixmyjs')
jshint(stringOfCode, objectOfOptions)
var stringFixedCode = fixmyjs(jshint.data(), stringOfCode, objectOfOptions).run()
```

## Website

[fixmyjs.com](http://fixmyjs.com) allows you to use this tool on the web.

## Currently supports

* `asi` Missing semicolons.
* `camelcase|snakecase` Enforces camelCase and snake_case convention.
* `curly` Adds curly braces to statements.
* `debugger` Removes debugger statements
* `plusplus` Converts plusplus and minusminus.
* `quotmark` Enforces single and double quote style.
* Adds parenthesis when invoking a constructor
* Adds the radix parameter to parseInt
* Convert to use array literal and object literal
* Dot notation conversion
* Extra trailing commas
* Leading and trailing zeroes on decimals.
* Missing whitespaces.
* Mixed spaces/tabs
* Proper indentation
* Removes deletion of variables
* Removes `undefined` when assigning to variables
* Removes unnecessary semicolons
* Uses isNaN function rather than comparing to NaN

### Contributing

* Indent 2 spaces
* Single quotes > Double quotes
* Use ASI
* Maximum line length is 80 characters
* Avoid mutation
* Write tests
* Code must pass `npm test`

# License

Copyright (C) 2011 by Josh Perez <josh@goatslacker.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
