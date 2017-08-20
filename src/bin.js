var fixpack = require('./index')
var path = require('path')
var defaultConfig = require('./config.json')
var config = require('rc')('fixpack', defaultConfig)
var files = config._

if (files.length) {
  config.files = files
}

config.files.forEach(function (file) {
  fixpack(path.resolve(file), config)
})
