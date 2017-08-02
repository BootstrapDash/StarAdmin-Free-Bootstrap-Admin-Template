/* eslint-env mocha */
'use strict';
var path = require('path');
var File = require('gulp-util').File;
require('should');
var getFilepath = require('./');

describe('getFilepath', function () {
  describe('(relative=false)', function () {
    it('returns the path relative to the source file\'s cwd', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source);
      filepath.should.equal('dir/file.js');
    });

    it('returns the unixified path relative to the source file\'s cwd', function () {
      var source = new File({
        cwd: 'C:\\a\\folder',
        path: 'C:\\a\\folder\\dir\\file.js',
        base: 'C:\\a\\folder\\dir'
      });

      var filepath = getFilepath(source);
      filepath.should.equal('dir/file.js');
    });
  });

  describe('(relative=true)', function () {
    it('returns the path relative to the target file\'s directory', function () {
      var target = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir1', 'index.html'),
        base: path.join(__dirname, 'dir1')
      });
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir2', 'file.js'),
        base: path.join(__dirname, 'dir2')
      });

      var filepath = getFilepath(source, target, {relative: true});
      filepath.should.equal('../dir2/file.js');
    });

    it('returns the unixified path relative to the source file\'s cwd', function () {
      var target = new File({
        cwd: 'C:\\a\\folder',
        path: 'C:\\a\\folder\\dir1\\index.html',
        base: 'C:\\a\\folder\\dir1'
      });
      var source = new File({
        cwd: 'C:\\a\\folder',
        path: 'C:\\a\\folder\\dir2\\file.js',
        base: 'C:\\a\\folder\\dir2'
      });

      var filepath = getFilepath(source, target, {relative: true});
      filepath.should.equal('../dir2/file.js');
    });
  });

  describe('(ignorePath)', function () {
    it('removes the provided `ignorePath` from the beginning of the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {ignorePath: 'dir'});
      filepath.should.equal('file.js');
    });

    it('removes the provided `ignorePath` even if it both begins and ends in a `/` from the beginning of the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {ignorePath: '/dir/'});
      filepath.should.equal('file.js');
    });

    it('removes the provided `ignorePath`s from the beginning of the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {ignorePath: ['dir', 'dir2']});
      filepath.should.equal('file.js');
    });

    it('removes the provided `ignorePath` unixified from the beginning of the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'deep', 'file.js'),
        base: path.join(__dirname, 'dir', 'deep')
      });

      var filepath = getFilepath(source, null, {ignorePath: ['\\dir\\deep']});
      filepath.should.equal('file.js');
    });

    it('removes the provided `ignorePath` unixified from the beginning of a unixified path', function () {
      var source = new File({
        cwd: 'C:\\a\\folder',
        path: 'C:\\a\\folder\\dir\\deep\\file.js',
        base: 'C:\\a\\folder\\dir\\deep'
      });

      var filepath = getFilepath(source, null, {ignorePath: ['\\dir\\deep']});
      filepath.should.equal('file.js');
    });

    it('removes the provided `ignorePath` from the beginning of a unixified path', function () {
      var source = new File({
        cwd: 'C:\\a\\folder',
        path: 'C:\\a\\folder\\dir\\deep\\file.js',
        base: 'C:\\a\\folder\\dir\\deep'
      });

      var filepath = getFilepath(source, null, {ignorePath: ['dir/deep']});
      filepath.should.equal('file.js');
    });
  });

  describe('(addRootSlash=true)', function () {
    it('prepends the path with a `/`', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {addRootSlash: true});
      filepath.should.equal('/dir/file.js');
    });
  });

  describe('(addPrefix)', function () {
    it('prepends the prefix and a `/` to the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {addPrefix: 'hello'});
      filepath.should.equal('hello/dir/file.js');
    });

    it('keeps any leading `/` from the prefix', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {addPrefix: '/hello'});
      filepath.should.equal('/hello/dir/file.js');
    });
  });

  describe('(addSuffix)', function () {
    it('appends the suffix to the path', function () {
      var source = new File({
        cwd: __dirname,
        path: path.join(__dirname, 'dir', 'file.js'),
        base: path.join(__dirname, 'dir')
      });

      var filepath = getFilepath(source, null, {addSuffix: '?hello'});
      filepath.should.equal('dir/file.js?hello');
    });
  });
});
