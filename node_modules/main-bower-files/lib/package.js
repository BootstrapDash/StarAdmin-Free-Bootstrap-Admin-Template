var path     = require('path'),
    readFile = require('fs').readFileSync,
    exists   = require('path-exists').sync,
    globby   = require('globby').sync,
    logger   = require('./logger');

/**
 * Holds information of the bower package
 *
 * @class Package
 */

/**
 * @constructor
 * @param {Object}              opts
 * @param {PackageCollection}   collection
 */
function Package(opts, collection) {
    this.collection     = collection;
    this.name           = opts.name || null;
    this.path           = opts.path || null;
    this.main           = opts.main || null;
    this.dependencies   = opts.dependencies;
    this.ignore         = opts.ignore || false;
    this.debugging      = collection.debugging || false;

    if (this.ignore) {
        return;
    }

    this.collectData();
    this.addDependencies();
};

Package.prototype = {
    /**
     * Collects data from first found config file
     */
    collectData: function() {
        var paths = [
                path.join(this.path, '.bower.json'),
                path.join(this.path, 'bower.json'),
                path.join(this.path, 'package.json'),
                path.join(this.path, 'component.json')
            ],
            data = paths.reduce(function(prev, curr) {
                if (prev && prev.main) {
                    return prev;
                }

                if (!exists(curr)) {
                    return prev;
                }

                try {
                    return JSON.parse(readFile(curr, 'utf8'));
                } catch (e) {
                    return null;
                }
            }, null);

        if (!data) {
            return;
        }

        if (!this.main && data.main) {
            this.main = data.main;

            if (this.debugging) {
                logger('Package', 'overriding main', this.name, data.main);
            }
        }

        if (!this.main && this.collection.opts.checkExistence) {
            throw new Error('Main property of package "' + this.name + '" is missing.');
        }

        if (this.dependencies === undefined && data.dependencies && data.dependencies) {
            this.dependencies = data.dependencies;

            if (this.debugging) {
                logger('Package', 'overriding dependencies', this.name, data.dependencies);
            }
        }
    },

    /**
     * Adds package dependencies to the collection
     */
    addDependencies: function() {
        for (var name in this.dependencies) {
            this.collection.add(name, path.join(this.path, '..', name));
        }
    },

    /**
     * Gets main files of the package
     *
     * @param  {Boolean}
     *      force  If true it will not wait for the dependencies
     * @return {Mixed}
     *      Returns false if the package has dependencies which were not
     *      processed yet otherwise an array of file paths
     */
    getFiles: function(force) {
        var main = this.main = this.main || this.collection.opts.main,
            files = [],
            name;

        if (main && typeof main === 'object' && !Array.isArray(main)) {
            main = main[this.collection.opts.env];
        }

        if (this.ignore || !main) {
            return files;
        }

        if (!Array.isArray(main)) {
            main = [main];
        }

        if (force !== true) {
            for (name in this.dependencies) {
                if (this.collection._processed[name] !== true) {
                    return false;
                }
            }
        }

        main.forEach(function(pattern) {
            if (pattern[0] === '/') {
                throw new Error('absolute path in bower main is not supported');
            }

            var _files = globby(pattern, {
                cwd: this.path
            });

            if (!_files.length && this.collection.opts.checkExistence) {
                throw new Error('File on path "' + path.join(this.path, pattern) +
                    '" does not exist.');
            }

            _files.forEach(function(file) {
                files.push(path.join(this.path, file));
            }, this);
        }, this);

        if (this.debugging) {
            files.forEach(function(file) {
                logger('Package', 'select file', this.name, file);
            }, this);
        }

        return files;
    }
};

module.exports = Package;
