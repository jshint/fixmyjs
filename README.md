# fixmyjs || jshint-autofix

[![Build Status](https://secure.travis-ci.org/goatslacker/fixmyjs.png)](http://travis-ci.org/goatslacker/fixmyjs)

Meant to automatically fix your lint errors in a non-destructive way.

For the nodejs package see https://github.com/goatslacker/node-fixmyjs

For the website see https://github.com/goatslacker/fixmyjs.com

## How to Install CLI

    npm install fixmyjs

## Website

http://fixmyjs.com allows you to use this tool on the web.

## Currently supports

* Missing semicolon. `var a = 1` -> `var a = 1;`

* Missing spaces. `white`

* Multiple definitions of a variable in scope.

* Statements written better in dot notation vs square bracket notation. `foo['hello']` -> `foo.hello`

* Mixed spaces/tabs

* Unnecessary semicolons `if (1) { };` -> `if (1) { }`

* Removes confusing trailing decimal points `4.` -> `4`

* Obj & Array literals instead of new Array | new Object `var arr = new Array();` -> `var arr = [];`

* Adds 0 to leading decimals `.2` -> `0.2`

* Adds parenthesis when invoking a constructor without them `var a = new Foo;` -> `var a = new Foo();`

* Removes `undefined` when assigning to variables

* Removes debugger statements

* Uses isNaN function rather than comparing to NaN `a === NaN` -> `isNaN(a)`

* Moves the invocation of a function within it's parenthesis `(function () { })()` -> `(function () { }())`

* Extra comma `var a = [1,,2];` -> `var a = [1,2];`

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
