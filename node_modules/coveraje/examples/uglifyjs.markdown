#  coveraje
## a simple javascript code coverage tool...

### How to see coverage reults for UglifyJS

To see how much the [UglifyJS](https://github.com/mishoo/UglifyJS) tests cover the UglifyJS code, copy the file `uglifyjs_coveraje` into the `test` folder of UglifyJS, go to this folder and run the new file.

On linux you need to make it executable by using `chmod`.

    ./uglifyjs_coveraje

Alternatively you can use

    node uglifyjs_coveraje

instead (that's the way it works on Windows, too).

Currently, you have have to change the file `/test/unit/scripts.js`, so that instead of

    require('uglify-js')
in line 2

    require('../../uglify-js')
is called.
You'll need [nodeunit](https://github.com/caolan/nodeunit) to run the unit-tests.