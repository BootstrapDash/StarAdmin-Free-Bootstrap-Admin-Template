var readFile           = require('fs').readFileSync,
    exists             = require('path-exists').sync,
    path               = require('path'),
    multimatch         = require('multimatch'),
    PackageCollection  = require('./package_collection');

module.exports = function(filter, opts, cb) {
    var collection,
        files,
        config,
        bowerrc,
        bowerJson,
        bowerDirectory,
        cwd = process.cwd(),
        error;

    if (typeof filter === 'function') {
        cb = filter
        opts = null;
        filter = null;
    } else if (typeof filter !== 'string' && Array.isArray(filter) === false && !(filter instanceof RegExp)) {
        if (typeof opts === 'function') {
            cb = opts;
        }
        opts = filter;
        filter = null;
    } else if (typeof opts === 'function') {
        cb = opts;
        opts = null;
    }

    if (typeof cb !== 'function') {
        cb = null;
    }

    opts = opts || {};
    opts.paths = opts.paths || {};
    opts.filter = opts.filter || filter;

    if (typeof opts.paths === 'string') {
        cwd = path.resolve(cwd, opts.paths);
    } else {
        bowerrc = opts.paths.bowerrc;
    }

    bowerrc = path.resolve(cwd, bowerrc || '.bowerrc');

    if (exists(bowerrc) && (config = JSON.parse(readFile(bowerrc, 'utf-8')))) {
        cwd = path.dirname(bowerrc);
        if (config.cwd) {
            cwd = path.resolve(cwd, config.cwd);
        }
        if (config.directory) {
            bowerDirectory = config.directory;
        }
    }

    bowerJson = opts.paths.bowerJson ? path.resolve(process.cwd(), opts.paths.bowerJson)
                                     : path.resolve(cwd, bowerJson || 'bower.json');

    bowerDirectory = opts.paths.bowerDirectory ?
        path.resolve(process.cwd(), opts.paths.bowerDirectory) :
        path.resolve(cwd, bowerDirectory || 'bower_components');

    if (!bowerJson || !exists(bowerJson)) {
        error = Error('bower.json file does not exist at ' + bowerJson);
        if (cb) {
            cb(error, []);
            return [];
        } else {
            throw error;
        }
    }

    if (!bowerDirectory || !exists(bowerDirectory)) {
        error = Error('Bower components directory does not exist at ' + bowerDirectory);
        if (cb) {
            cb(error, []);
            return [];
        } else {
            throw error;
        }
    }

    opts.base = opts.base || bowerDirectory;
    opts.includeDev = opts.includeDev || false;
    opts.includeSelf = opts.includeSelf || false;
    opts.paths = {
        bowerJson: bowerJson,
        bowerDirectory: bowerDirectory
    };

    try {
        collection = new PackageCollection(opts);
        files = collection.getFiles();

        if (typeof opts.filter === 'string' || Array.isArray(opts.filter)) {
            files = multimatch(files, opts.filter, {dot: true});
        } else if (opts.filter instanceof RegExp) {
            files = files.filter(function(file) {
                return opts.filter.test(file);
            });
        } else if (typeof opts.filter === 'function') {
            files = files.filter(opts.filter);
        }
    } catch (e) {
        if (cb) {
            cb(e, []);
            return [];
        } else {
            throw e;
        }
    }

    if (cb) {
        cb(null, files || [])
    }

    return files || [];
};
