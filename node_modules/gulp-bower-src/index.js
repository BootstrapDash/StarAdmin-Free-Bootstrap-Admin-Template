'use strict';
var fs = require("fs"),
    gulp = require("gulp"),
    path = require('path'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    DepGraph = require('dependency-graph').DepGraph;

var PLUGIN_NAME = "gulp-bower-src";

var loadConfigFile = function(bowerDirectory, name) {

    var configPath = bowerDirectory + "/" + name + "/" + '.bower.json';
    if(!fs.existsSync(configPath)) {
        throw new PluginError(PLUGIN_NAME, "The bower package " + name + " has no bower configuration file.");
    }
    return JSON.parse(fs.readFileSync(configPath));
}

var processDependencies = function(name, bowerJson, bowerDirectory, dependencies) {

    var basePath = bowerDirectory + "/" + name + "/";

    var updatePattern = function(pattern) {
        if(!pattern) {
            return "";
        }
        var isNegate = pattern[0] == "!";
        if(isNegate) {
            throw new PluginError(PLUGIN_NAME, "does not support ignore glob patterns - please override " + name);
        }
        return "!" + basePath + pattern;
    };

    var ignoreEmptyFolders = function(pattern) {
        if(!pattern || pattern.indexOf("/**", pattern.length -3) == -1) {
            return "";
        }
        else {
            return pattern.substring(0, pattern.length -3);
        }
    }

    var notNull = function(item) {
        return item;
    }

    var addNode = function(name) {
        if(!dependencies.graph.hasNode(name)) {
            dependencies.graph.addNode(name);
        }
    }

    addNode(name);
    if(!dependencies.components[name]) {
        var ignores = bowerJson.ignore || [];
        if(dependencies.overrides[name] && dependencies.overrides[name].ignore) {
            ignores = dependencies.overrides[name].ignore;
        }
        dependencies.components[name] = [(basePath + "**")]
            .concat(ignores.map(updatePattern).filter(notNull))
            .concat(ignores.map(ignoreEmptyFolders).map(updatePattern).filter(notNull));
    }

    if(bowerJson.dependencies) {
        for(var dep in bowerJson.dependencies) {
            addNode(dep);
            dependencies.graph.addDependency(name, dep);
            var depJson = loadConfigFile(bowerDirectory, dep);

            processDependencies(dep, depJson, bowerDirectory, dependencies);
        }
    }
}

var gulpBowerSrc = function(config) {

    config = config || {};

    if(!config.paths) {
        config.paths = {}
    }

    var bowerJsonPath = config.paths.bowerJson || "./bower.json";
    var bowerrcPath = config.paths.bowerrc || "./.bowerrc";
    var bowerDirectory = "./bower_components";

    if(fs.existsSync(bowerrcPath)){
        bowerDirectory = path.resolve("./", (JSON.parse(fs.readFileSync(bowerrcPath))).directory);
    }

    if(!fs.existsSync(bowerJsonPath)){
        throw new PluginError(PLUGIN_NAME, "bower.json file does not exist at " + bowerJsonPath);
    }

    try {
        var bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
    } catch (e) {
        throw new PluginError(PLUGIN_NAME, "The bower.json file at " + bowerJsonPath + " is not valid JSON.");
    }

    var dependencies = {};
    dependencies.components = {};
    dependencies.graph = new DepGraph();
    dependencies.overrides = bowerJson.overrides || {};

    dependencies.graph.addNode(bowerJson.name);
    dependencies.components[bowerJson.name] = [];

    processDependencies(bowerJson.name, bowerJson, bowerDirectory, dependencies);

    var srcs = dependencies.graph.overallOrder()
        .map(function(name){
            return dependencies.components[name];
        })
        .reduce(function(previous,current) {
            return previous.concat(current);
        });

    return gulp.src(srcs, {base:bowerDirectory});
};

module.exports = gulpBowerSrc;