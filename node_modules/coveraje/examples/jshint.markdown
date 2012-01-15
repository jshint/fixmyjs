#  coveraje
## a simple javascript code coverage tool...

### How to see coverage reults for jshint

To see how much the [jshint](https://github.com/jshint/jshint) tests cover the jshint code, copy the file `jshint_coveraje` into the `tests` folder of jshint, go to this folder and run the new file.
On linux you need to make it executable by using `chmod`.

    ./jshint_coveraje

Alternatively you can use

    node jshint_coveraje

instead (that's the way it works on Windows, too).

You'll need [expresso](http://visionmedia.github.com/expresso/) to be installed (and of course `coveraje` and [node.js](https://github.com/joyent/node))
