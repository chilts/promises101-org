var fs = require('fs')
var path = require('path')

var async = require('async')
var bluebird = require('bluebird')

var fsProm = bluebird.promisifyAll(fs)

module.exports.plain = function plain(filename, callback) {
  fs.readFile(filename, function(err, val) {
    if (err) return callback(err)

    try {
      var val = JSON.parse(val)
      return callback(null, val)
    }
    catch(e) {
      return callback(e)
    }
  })
}

function parse(data, callback) {
  try {
    var v = JSON.parse(data)
    process.nextTick(callback.bind(null, null, v))
  }
  catch (e) {
    process.nextTick(callback.bind(null, e))
  }
}

module.exports.better = function plain(filename, callback) {
  fs.readFile(filename, function(err, data) {
    if (err) return callback(err)
    parse(data, callback)
  })
}

module.exports.async = function plain(filename, callback) {
  async.waterfall(
    [
      function(done) {
        fs.readFile(filename, 'utf8', done)
      },
      function(data, done) {
        try {
          done(null, JSON.parse(data))
        }
        catch(e) {
          done(e)
        }
      }
    ],
    callback
  )
}

module.exports.asyncBetter = function plain(filename, callback) {
  async.waterfall(
    [
      fs.readFile.bind(fs, filename, 'utf8'),
      parse.bind(null)
    ],
    callback
  )
}

module.exports.promise = function promise(filename) {
  return fsProm
    .readFileAsync(filename)
    .then(JSON.parse)
}
