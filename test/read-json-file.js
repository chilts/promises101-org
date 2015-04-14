// core
var path = require('path')

// npm
var test = require('tape')

// local
var readFile = require('./read-json-file/')

test('read a file in', function(t) {
  t.plan(5)

  var filename = path.join(__dirname, 'read-json-file', 'file-ok.json')
  var expected = {
    msg: 'Hello, World!'
  }

  // plain
  console.log(filename)
  readFile.plain(filename, function(err, data) {
    t.ok(!err, 'plain: there was no error')
    t.deepEqual(data, expected, 'plain: the data was correct')
  })

  // async
  readFile.async(filename, function(err, data) {
    t.ok(!err, 'async: there was no error')
    t.deepEqual(data, expected, 'async: the data was correct')
  })

  // bluebird
  readFile.promise(filename)
    .then(function(data) {
      t.deepEqual(data, expected, 'promise: the data was correct')
    }, function(err) {
      t.fail('promise: we should not have received an error')
    })
  ;
})

test('read an invalid JSON file in', function(t) {
  t.plan(5)

  var filename = path.join(__dirname, 'read-json-file', 'file-err.json')
  var errMsg = 'SyntaxError: Unexpected token m'

  // plain
  readFile.plain(filename, function(err, data) {
    t.ok(err, 'plain: there an error parsing the JSON')
    t.equal('' + err, errMsg, 'The error was correct')
  })

  // async
  readFile.async(filename, function(err, data) {
    t.ok(err, 'plain: there an error parsing the JSON')
    t.equal('' + err, errMsg, 'The error was correct')
  })

  // bluebird
  readFile.promise(filename)
    .then(function(data) {
      t.fail('promise: there should have been an error parsing the JSON')
    }, function(err) {
      t.equal('' + err, errMsg, 'The error was correct')
    })
  ;
})

test('read a non-existant file in', function(t) {
  t.plan(5)

  var filename = path.join(__dirname, 'read-json-file', 'file-not-found.json')
  var errMsg = 'Error: ENOENT, open '

  // plain
  readFile.plain(filename, function(err, data) {
    t.ok(err, 'plain: there an error opening the file')
    t.equal(('' + err).substr(0, 20), errMsg, 'plain: The error was correct')
  })

  // async
  readFile.async(filename, function(err, data) {
    t.ok(err, 'plain: there an error opening the file')
    t.equal(('' + err).substr(0, 20), errMsg, 'async: The error was correct')
  })

  // bluebird
  readFile.promise(filename)
    .then(function(data) {
      t.fail('promise: there should have been an error opening the file')
    }, function(err) {
      t.equal(('' + err).substr(0, 20), errMsg, 'promise: The error was correct')
    })
  ;
})
