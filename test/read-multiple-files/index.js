//
// The plan here is to call a function which will read in multiple files
// and return the contents. If any file is missing, then an error should
// be returned and none of the other contents read will be returned.
//
// We will read the files in parallel rather than sequential.
//

var fs = require('fs')
var path = require('path')

var async = require('async')
var bluebird = require('bluebird')

// var fsProm = bluebird.promisifyAll(fs)
var readFileP = bluebird.promisify(fs.readFile)

module.exports.plain = function plain(filenames, callback) {
  var done = filenames.length
  var results = []
  var finished = false

  if ( filenames.length === 0 ) {
    // don't invoke zalgo
    return process.nextTick(callback.bind(null, null, []))
  }

  filenames.forEach(function(filename, i) {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) {
        if ( !finished ) {
          finished = true // so we don't call the callback again
          // called on first error only, other errors are ignored
          callback(err)
        }
        return
      }
      results[i] = data
      done--
      if ( done === 0 ) {
        callback(null, results)
      }
    })
  })
}

module.exports.async = function plain(filenames, callback) {
  async.map(
    filenames,
    function(filename, done) {
      // Can't do a fs.readFile.bind(...) here since 'utf8' is in the middle
      // of `filename` and `done`.
      fs.readFile(filename, 'utf8', done)
    },
    callback
  )
}

module.exports.promise = function promise(filenames) {
  var promises = filenames.map(function(filename) {
    return readFileP(filename, 'utf8')
  })
  return bluebird.all(promises)
}
