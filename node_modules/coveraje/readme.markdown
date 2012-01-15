#  coveraje
## a simple javascript code coverage tool...

### Usage 

---------------
coveraje provides only only few public functions

```javascript
    coveraje.cover(code, runner, options, callback)
```
> 
> `code` _string_ || _function_  
>     the code that should be tested.
>     if it's a function, it should return a string
>     this function is called, everytime the page is refreshed (F5)
> 
> `runner` _function_ | _{ key: function }_  
>     This parameter takes a runner-function, or an object with multiple runners.  
>     If it's an object with multiple runners, the key should be descriptive (it's used to distinguish between the runners). The runner/s is/are called from coveraje.
>     
>   ```javascript
>         function runner(context){
>             // code to run
>         }
>   ```
>   Each runner is called with one argument - the context. There you can find the global scope of the executed code.  
>   In order to get asynchronous tests run until the end, you have to use
>   
>   ```javascript
>   return coveraje.runHelper.createEmitter(function (event) {
>       // test code, e.g.
>       require("fs").readFile("path", function (err, data) {
>           event.complete();
>       })
>   })
>   ```
>   as your runner code. Don't use `setTimeout/setInterval` in your test directly. Use `context.setTimeout`/`context.setInterval` instead.  
>   Don't forget `event.complete();`.
>   
> `options` _{ key: value }_  
> Currently, there are the following options  
> 
> > `beautify` _boolean_  
> >     if true, the code to inspect will be beautified (by uglifyjs) first  
> >     All comments are stripped by the beautifier.  
> >     _default_: __false__  
> > 
> > `colorizeShell` _boolean_  
> >     if true, uses ANSI escape sequences to color the console output  
> >     In case you get wierd text in your console, turn it off...  
> >     _default_: __true__  
> > 
> > `globals` _"node"_, _"browser"_, or any combination  
> >     defines, which global objects are defined. the modes can be combined (separated with blanks).  
> >     "browser" requires jsdom (which has some known problems on windows (*contextify*))  
> >     _default_: __""__  
> > 
> > `prefix` _string_  
> >     while injecting code, also some variables has to be defined. These are prefixed so they don't interfere with the variables defined in code. Usually, you don't have to change this prefix, unless you have variables starting with `_cj$_`.  
> >     _default_: __"\_cj$\_"__  
> > 
> > `quiet` _boolean_  
> >     if true, suppress output to console  
> >     _default_: __false__  
> > 
> > `serverHost` _string_  
> >     the host to use if `useServer = true`  
> >     _default_: __"127.0.0.1"__  
> > 
> > `serverPort` _int_  
> >     the port to use if `useServer = true`  
> >     _default_: __13337__  
> > 
> > `stripFirstComments` _boolean_  
> >     removes all starting comments from the code. You won't always scroll to the first line of code ;)  
> >     _default_: __true__  
> > 
> > `stripSheBang` _boolean_  
> >     removes `\#!...` if it's in the first line  
> >     _default_: __true__  
> > 
> > `useServer` _boolean_  
> >     starts a web server to provide the results in your favorite browser.  
> >     You are able to start every or a single runner and see the results  
> >     _default_: __false__  
> > 
> > `wait` _int_  
> >     if the code uses `setTimeout/setInterval`, you can wait some time before the results are generated.  
> >     It's better to use `coveraje.runHelper.createEmitter()`.  
> >     _default_: __0__  
> > 
> > `__filename` _string_  
> >     sometimes its needed (if you test a node module) that the correct \_\_filename and \_\_dirname is set during the tests.  
> >     _default_: __""__  
>
> `callback`  
> the callback function is called after all requested runners are finished.  

###  Dependencies:

---------------
#### coveraje needs

* [Node.js](http://nodejs.org/)  
  The runtime. A version that runs in browsers only is on the agenda.  

* [UglifyJS](https://github.com/mishoo/UglifyJS)  

#### Sometimes-Dependencies

* [JQuery](http://jquery.com/)  
  The web interface uses __jquery__ (latest version is loaded from [jQuery CDN](http://code.jquery.com/))  

* [JSDom](https://github.com/tmpvar/jsdom)  
  Depending on the configuration (option `globals`), __jsdom__ (and its dependencies) is used.  
  Currently it does not work well on Windows (blame on __contextify__) - but it should work in the near future ([promised for version 0.3.0](http://groups.google.com/group/jsdom/browse_thread/thread/b3102ac36f281891))  

* [expresso](http://visionmedia.github.com/expresso/)  
  if you choose the __expresso__ helper, you will need expresso ;)  
  
* [nodeunit](https://github.com/caolan/nodeunit)  
  if you choose the __nodeunit__ helper, you will need nodeunit...  

#### Development-Dependencies

* [JSHint](http://jshint.com/)  
  all js-files are linted by __jshint__, so it's needed for the tests  

* [expresso](http://visionmedia.github.com/expresso/)  
  for the unit tests  

###  TDD Frameworks:

---------------
If you have unit tests (you should) and want to know how they cover your source code, you may try it with a helper to create a _test runners_.  
Currently there are helpers for __expresso__ and __nodeunit__.  

The __expresso__-helper modifies the __expresso__-source code on the fly (not permanent). This can lead to bugs in future versions of __expresso__ (_will say_: please report bugs as soon as possible \*g\*).  
