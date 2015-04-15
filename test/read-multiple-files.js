// core
var path = require('path')

// npm
var test = require('tape')

// local
var readMultipleFiles = require('./read-multiple-files/')

var filename1 = path.join(__dirname, 'read-multiple-files', 'one.txt')
var filename2 = path.join(__dirname, 'read-multiple-files', 'two.txt')
var filename3 = path.join(__dirname, 'read-multiple-files', 'three.txt')
var filenameUnknown = path.join(__dirname, 'read-multiple-files', 'unknown.txt')
var filenameNotFound = path.join(__dirname, 'read-multiple-files', 'not-found.txt')

test('read a file in', function(t) {
  t.plan(5)

  var files = [ filename1, filename2, filename3 ]
  var expected = [ 'one\n', 'two\n', 'three\n' ]

  // plain
  readMultipleFiles.plain(files, function(err, data) {
    t.ok(!err, 'plain: there was no error')
    t.deepEqual(data, expected, 'plain: the data was correct')
  })

  // async
  readMultipleFiles.async(files, function(err, data) {
    t.ok(!err, 'async: there was no error')
    t.deepEqual(data, expected, 'async: the data was correct')
  })

  // bluebird
  readMultipleFiles.promise(files)
    .then(function(data) {
      t.deepEqual(data, expected, 'promise: the data was correct')
    }, function(err) {
      t.fail('promise: we should not have received an error')
    })
  ;
})

test('read an empty array', function(t) {
  t.plan(5)

  var files = []
  var expected = []

  // plain
  readMultipleFiles.plain(files, function(err, data) {
    t.ok(!err, 'plain: there was no error')
    t.deepEqual(data, expected, 'plain: the data was correct')
  })

  // async
  readMultipleFiles.async(files, function(err, data) {
    t.ok(!err, 'async: there was no error')
    t.deepEqual(data, expected, 'async: the data was correct')
  })

  // bluebird
  readMultipleFiles.promise(files)
    .then(function(data) {
      t.deepEqual(data, expected, 'promise: the data was correct')
    }, function(err) {
      t.fail('promise: we should not have received an error')
    })
  ;
})

test('read an invalid JSON file in', function(t) {
  t.plan(5)

  var files = [ filename1, filenameNotFound, filename3 ]
  var errMsg = 'Error: ENOENT, open '

  // plain
  readMultipleFiles.plain(files, function(err, data) {
    t.ok(err, 'plain: there an error loading up a file')
    t.equal(('' + err).substr(0, 20), errMsg, 'plain: The error was correct')
  })

  // async
  readMultipleFiles.async(files, function(err, data) {
    t.ok(err, 'async: there an error parsing the JSON')
    t.equal(('' + err).substr(0, 20), errMsg, 'async: The error was correct')
  })

  // bluebird
  readMultipleFiles.promise(files)
    .then(function(data) {
      t.fail('promise: there should have been an error parsing the JSON')
    }, function(err) {
      t.equal(('' + err).substr(0, 20), errMsg, 'promise: The error was correct')
    })
  ;
})

test('read a non-existant file in', function(t) {
  t.plan(5)

  var files = [ filenameUnknown, filenameNotFound, filename3 ]
  var errMsg = 'Error: ENOENT, open '

  // plain
  readMultipleFiles.plain(files, function(err, data) {
    t.ok(err, 'plain: there an error opening the file')
    t.equal(('' + err).substr(0, 20), errMsg, 'plain: The error was correct')
  })

  // async
  readMultipleFiles.async(files, function(err, data) {
    t.ok(err, 'async: there an error opening the file')
    t.equal(('' + err).substr(0, 20), errMsg, 'async: The error was correct')
  })

  // bluebird
  readMultipleFiles.promise(files)
    .then(function(data) {
      t.fail('promise: there should have been an error opening the file')
    }, function(err) {
      t.equal(('' + err).substr(0, 20), errMsg, 'promise: The error was correct')
    })
  ;
})
