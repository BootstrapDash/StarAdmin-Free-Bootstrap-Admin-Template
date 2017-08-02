main-bower-files
================
![status](https://secure.travis-ci.org/ck86/main-bower-files.png?branch=master)

- [Usage](#usage)
    - [Usage with gulp](#usage-with-gulp)
    - [Usage with grunt](#usage-with-grunt)
- [Options](#options)
    - [Overrides Options](#overrides-options)
        - [main](#main)
        - [ignore](#ignore)
        - [dependencies](#dependencies)
    - [Common Options](#common-options)
        - [debugging](#debugging)
        - [main](#main-1)
        - [env](#env)
        - [paths](#paths)
        - [checkExistence](#checkexistence)
        - [includeDev](#includedev)
        - [includeSelf](#includeself)
        - [filter](#filter)
        - [overrides](#overrides)

## Usage

```javascript
var mainBowerFiles = require('main-bower-files');
var files = mainBowerFiles([[filter, ]options][, callback]);
```

If first argument is type of `String`, `Array` or `RegExp` it will be used as a filter, otherwise it will be used as options.

This will read your `bower.json`, iterate through your dependencies and returns an array of files defined in the main property of the packages `bower.json`.

You can override the behavior if you add an `overrides` property to your own `bower.json`.

### Usage with gulp

```javascript
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('TASKNAME', function() {
    return gulp.src(mainBowerFiles())
        .pipe(/* what you want to do with the files */)
});
```

#### You've got a flat folder/file structure after `.pipe(gulp.dest('my/dest/path'))`?

`mainBowerFiles` returns an array of files where each file is a absolute path without any globs (** or *). gulp requires globs in these paths to apply the base path. Because of this, you always have to tell gulp your bower base path (the path to the bower_components directory) explicitly.

Here is an example:

```javascript
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('TASKNAME', function() {
    return gulp.src(mainBowerFiles(/* options */), { base: 'path/to/bower_components' })
        .pipe(/* what you want to do with the files */)
});
```

Now you should get something like `my/dest/path/jquery/jquery.js` if you have jquery installed.

### Usage with grunt

Install this plugin with the following command:

```bash
npm install --save-dev main-bower-files
```

Once that's done, add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('main-bower-files');
```

In your project's Gruntfile, add a section named `bower` to the data object passed into `grunt.initConfig()`, like so:

```javascript
grunt.initConfig({
    bower: {
        dev: {
            base: 'bower_components', /* the path to the bower_components directory */
            dest: 'web/bower_components',
            options: {
                checkExistence: true,
                debugging: true,
                paths: {
                    bowerDirectory: 'bower_components',
                    bowerrc: '.bowerrc',
                    bowerJson: 'bower.json'
                }
            }
        },
        flat: { /* flat folder/file structure */
            dest: 'public/vendor',
            options: {
                debugging: true
            }
        }
    }
});
````

## Options

### Overrides Options

These options can be set directly in your `bower.json` file, e.g.:

```js
{
    "name": "your-package-name",
    "dependencies": {
        "BOWER-PACKAGE": "*"
    },
    "overrides": {
        "BOWER-PACKAGE": {
            // Here you can override the main files or ignoring this package, for more info see options
        }
    }
}
```

#### main

Type: `String` or `Array` or `Object`

You can specify which files should be selected. You can `main-bower-files` select files based on the `process.env.NODE_ENV` if you provide an `Object` with `keys` as the environment, e.g.:

```json
{
    "overrides": {
        "BOWER-PACKAGE": {
            "main": {
                "development": "file.js",
                "production": "file.min.js"
            }
        }
    }
}
```

You can also use glob pattern to select files, e.g.:

```json
{
    "overrides": {
        "BOWER-PACKAGE": {
            "main": "**/*.js"
        }
    }
}
```

#### ignore

Type: `Boolean` Default: `false`

Set to `true` if you want to ignore this package.

#### dependencies

Type: `Object`

You can override the dependencies of a package. Set to `null` to ignore the dependencies.

### Common Options

These options can be passed to this plugin, e.g: `mainBowerFiles(/* options*/)`

#### debugging

Type: `boolean` Default: `false`

Set to `true` to enable debugging output.

#### main

Type: `String` or `Array` or `Object` Default: `null`

You can specify for all packages a default main property which will be used if the package does not provide a main property.

#### env

Type: `String` Default: `process.env.NODE_ENV`

If `process.env.NODE_ENV` is not set you can use this option.

#### paths

Type: `Object` or `String`

You can specify the paths where the following bower specific files are located:

`bower_components`, `.bowerrc` and `bower.json`

For example:

```javascript
mainBowerFiles({
    paths: {
        bowerDirectory: 'path/for/bower_components',
        bowerrc: 'path/for/.bowerrc',
        bowerJson: 'path/for/bower.json'
    }
})
.pipe(gulp.dest('client/src/lib'));
```

If a `String` is supplied instead, it will become the basepath for default paths.

For example:

```javascript
mainBowerFiles({ paths: 'path/for/project' });
/*
    {
        bowerDirectory: 'path/for/project/bower_components',
        bowerrc: 'path/for/project/.bowerrc',
        bowerJson: 'path/for/project/bower.json'
    }
*/
```

#### checkExistence

Type: `boolean` Default: `false`

Set this to true if you want that the plugin checks every file for existence.

If enabled and a file does not exists, the plugin will throw an exception.

#### includeDev

Type: `mixed` Default: `false`

You can include your devDependencies in two ways:

* Set this option to `inclusive` or true to add the devDependencies to your dependencies
* or use `exclusive` to exclude your dependencies

#### includeSelf

Type: `boolean` Default: `false`

Set this to true to add the main files to your dependencies

### filter

Type: `RegExp` or `function` or `glob` Default: `null`

You can filter the list of files by a regular expression, glob or callback function (the first and only argument is the file path).

### overrides

Type: `object` Default: `{}`

Set default overrides option which can be overridden in the `overrides` section of the `bower.json`

### group

Type: `String` or `Array` Default: `null`

You can specify a group of dependencies you want to read from bower.json

For example:

```json
{
    "dependencies": {
        "BOWER-PACKAGE-1": "*",
        "BOWER-PACKAGE-2": "*",
        "BOWER-PACKAGE-3": "*",
        "BOWER-PACKAGE-4": "*"
    },
    "group": {
        "home": [ "BOWER-PACKAGE-1" ],
        "contact": [ "BOWER-PACKAGE-4" ],
        "admin": [ "BOWER-PACKAGE-1", "BOWER-PACKAGE-2", "BOWER-PACKAGE-3" ]
    }
}
```

```javascript
mainBowerFiles({ paths: 'path/for/project', group: 'home' });
```

You can select multiple groups with an array.

```javascript
mainBowerFiles({ paths: 'path/for/project', group: ['home', 'contact'] });
```

You can include all packages except for those listed in a group with the `!` operator.

```javascript
mainBowerFiles({ paths: 'path/for/project', group: '!home' });
```

## LICENSE

(MIT License)

Copyright (c) 2013 Christopher Knötschke <cknoetschke@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
