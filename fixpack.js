#!/usr/bin/env node
var ALCE = require('alce')
var extend = require('extend-object')
var fs = require('fs')
var path = require('path')
require('colors')

var defaultConfig = require('./config')

function checkMissing (pack, config) {
  var warnItems
  var required
  if (pack.private) {
    warnItems = config.warnOnPrivate
    required = config.requiredOnPrivate
  } else {
    warnItems = config.warn
    required = config.required
  }
  required.forEach(function (key) {
    if (!pack[key]) throw new Error(config.fileName + ' files must have a ' + key)
  })
  warnItems.forEach(function (key) {
    if (!pack[key] && !config.quiet) console.log(('missing ' + key).yellow)
  })
}

function sortAlphabetically (object) {
  if (Array.isArray(object)) {
    object.sort()
    return object
  } else {
    var sorted = {}
    Object.keys(object).sort().forEach(function (key) {
      sorted[key] = object[key]
    })
    return sorted
  }
}

module.exports = function (file, config) {
  config = extend(defaultConfig, config || {})
  if (!fs.existsSync(file)) {
    if (!config.quiet) console.log(('No such file: ' + file).red)
    process.exit(1)
  }
  config.fileName = path.basename(file)
  var original = fs.readFileSync(file, {encoding: 'utf8'})
  var pack = ALCE.parse(original)
  var out = {}
  var outputString = ''
  var key

  // make sure we have everything
  checkMissing(pack, config)

  // handle the specific ones we want, then remove
  config.sortToTop.forEach(function (key) {
    if (pack[key]) out[key] = pack[key]
    delete pack[key]
  })

  // sort the remaining
  pack = sortAlphabetically(pack)

  // add in the sorted ones
  for (key in pack) {
    out[key] = pack[key]
  }

  // sometimes people use a string rather than an array for the `keywords`
  // field when there is only one item listed
  if (typeof out.keywords === 'string') out.keywords = [out.keywords]

  // sort some sub items alphabetically
  config.sortedSubItems.forEach(function (key) {
    if (out[key]) out[key] = sortAlphabetically(out[key])
  })

  // wipe version numbers
  if (config.wipe) {
    var versionedKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
    versionedKeys.forEach(function (key) {
      const depGroup = out[key]
      if (depGroup) {
        for (var item in depGroup) {
          depGroup[item] = '*'
        }
      }
    })
  }

  // write it out
  outputString = JSON.stringify(out, null, 2) + '\n'

  if (outputString !== original) {
    fs.writeFileSync(file, outputString, {encoding: 'utf8'})
    if (!config.quiet) console.log(config.fileName.bold + ' fixed'.green + '!')
  } else {
    if (!config.quiet) console.log(config.fileName.bold + ' already clean'.green + '!')
  }
}
