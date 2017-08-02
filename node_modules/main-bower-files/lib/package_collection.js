var path                = require('path'),
    readFile            = require('fs').readFileSync,
    exists              = require('path-exists').sync,
    stripJsonComments   = require('strip-json-comments'),
    extend              = require('extend'),
    Package             = require('./package'),
    logger              = require('./logger');

/**
 * Collection for bower packages
 *
 * @class PackageCollection
 */

/**
 * @constructor
 * @param {Object} opts
 */
function PackageCollection(opts) {
    this.opts               = opts;
    this.opts.main          = opts.main || null;
    this.opts.env           = opts.env || process.env.NODE_ENV;
    this.debugging          = opts.debugging || false;
    this.overrides          = opts.overrides || {};
    this._queue             = [];
    this._lastQueueLength   = 0;
    this._packages          = {};
    this._processed         = {};

    this.collectPackages();
};

PackageCollection.prototype = {
    /**
     * Adds a package to the collection
     *
     * @param {String} name Name of the package
     * @param {String} path Path to the package files
     */
    add: function(name, path, main) {
        if (this._packages[name]) {
            return;
        }

        if (this.debugging) {
            logger('PackageCollection', 'add', name, path);
        }

        this._packages[name] = true;

        var opts = this.overrides[name] || {};
        opts.name = name;
        opts.path = path;
        if (path.indexOf(this.opts.paths.bowerDirectory) === -1) {
            opts.main = main || name;
        }
        opts.path = path;

        this._packages[name] = new Package(opts, this);
    },

    /**
     * Collects all packages
     */
    collectPackages: function() {
        if (!exists(this.opts.paths.bowerJson)) {
            throw new Error('bower.json does not exist at: ' + this.opts.paths.bowerJson);
        }

        var name,
            group = this.opts.group || null,
            includeDev = this.opts.includeDev || false,
            includeSelf = this.opts.includeSelf || false,
            bowerJson = JSON.parse(stripJsonComments(readFile(this.opts.paths.bowerJson, 'utf8'))),
            devDependencies = bowerJson.devDependencies || {},
            dependencies = bowerJson.dependencies || {},
            main = bowerJson.main || {};

        includeDev = includeDev === true ? 'inclusive' : includeDev;

        this.overrides = extend(bowerJson.overrides || {}, this.overrides);

        this.checkGroupExists(group, bowerJson, function (missingGroup) {
            throw new Error('group "' + missingGroup + '" does not exists in bower.json');
        });

        if (includeDev !== 'exclusive') {
            this.addDependencies(dependencies, group, bowerJson);
        }

        if (includeDev !== false) {
            this.addDependencies(devDependencies, group, bowerJson);
        }

        if (includeSelf !== false) {
            this.add(bowerJson.name || 'self', path.dirname(this.opts.paths.bowerJson), main);
        }
    },

    /**
     * Adds all dependencies from list filtered by group
     *
     */
    addDependencies: function (dependencies, group, bowerJson) {
        if (typeof dependencies !== "string") {
            var deps = (!!group) ? this.filterByGroup(dependencies, group, bowerJson) : dependencies;

            for (var name in deps) {
                this.add(name, path.join(this.opts.paths.bowerDirectory, path.sep, name));
            }
        } else {
            this.add(dependencies, path.join(path.dirname(this.opts.paths.bowerJson)));
        }
    },

    /**
     * Filters dependencies by group
     *
     * @return {Object}
     */
    filterByGroup: function (deps, group, bowerJson) {
        var filtered = {};

        if (typeof group === "string") {
            var isExludingGroup = (group && bowerJson.group && group.charAt(0) === "!" && bowerJson.group[group.slice(1)].length > 0);

            for (var dep in deps) {
                if (isExludingGroup && bowerJson.group[group.slice(1)].indexOf(dep) === -1) {
                    filtered[dep] = deps[dep];
                }
                if (!isExludingGroup && bowerJson.group[group].indexOf(dep) >= 0) {
                    filtered[dep] = deps[dep];
                }
            }

            return filtered;
        }

        if (typeof group === "object") {
            for (var i = 0; i < group.length; i++) {
                filtered = extend(filtered, this.filterByGroup(deps, group[i], bowerJson));
            }
        }

        return filtered;
    },

    /**
     * Calls error method if group doesn't exist
     */
    checkGroupExists: function (group, bowerJson, error) {
        if(!group || !bowerJson.group) {
            return;
        }

        if (typeof group === "string") {
            var isExludingGroup = (group && bowerJson.group && group.charAt(0) === "!" && bowerJson.group[group.slice(1)].length > 0);

            if(!bowerJson.group[group] && !isExludingGroup) {
                error(group);

                return;
            }

            return bowerJson.group[group];
        }

        if (typeof group === "object") {
            for (var i = 0; i < group.length; i++) {
                this.checkGroupExists(group[i], bowerJson, error);
            }
        }
    },

    /**
     * Get srcs of all packages
     *
     * @return {Array}
     */
    getFiles: function() {
        for (var name in this._packages) {
            this._queue.push(this._packages[name]);
        }

        return this.process();
    },

    /**
     * processes the queue and returns the srcs of all packages
     *
     * @private
     * @return {Array}
     */
    process: function() {
        var queue = this._queue,
            srcs = [],
            force = false;

        if (this._lastQueueLength === queue.length) {
            force = true;
        }

        this._lastQueueLength = queue.length;

        this._queue = [];

        queue.forEach(function(package) {
            var packageSrcs = package.getFiles(force);

            if (packageSrcs === false) {
                return this._queue.push(package);
            }

            srcs.push.apply(srcs, packageSrcs);
            this._processed[package.name] = true;
        }, this);

        if (this._queue.length) {
            srcs.push.apply(srcs, this.process());
        }

        return srcs;
    }
};

module.exports = PackageCollection;
