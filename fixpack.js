#!/usr/bin/env node
var fs = require('fs');
var colors = require('colors');
var required = ['name', 'version'];
var warn = ['description', 'author', 'repository', 'keywords', 'main', 'bugs', 'homepage', 'license'];
var ALCE = require('alce');
var os = require('os');


function checkMissing(pack, log) {
    required.forEach(function (key) {
        if (!pack[key]) throw new Error('package.json files must have a ' + key);
    });
    warn.forEach(function (key) {
        if (!pack[key] && log) console.log(('missing ' + key).yellow);
    });
}

function sortObjectKeysAlphabetically(object) {
    var sorted = {};
    Object.keys(object).sort().forEach(function (key) {
        sorted[key] = object[key];
    });
    return sorted;
}

module.exports = function (file, log) {
    var out = {};
    var pack = ALCE.parse(fs.readFileSync(file, {encoding: 'utf8'}));
    var key;

    // make sure we have everything
    checkMissing(pack);

    // handle the specific ones we want, then remove
    ['name', 'description', 'version', 'author'].forEach(function (key) {
        if (pack[key]) out[key] = pack[key];
        delete pack[key];
    });

    // sort the remaining
    pack = sortObjectKeysAlphabetically(pack);

    // add in the sorted ones
    for (key in pack) {
        out[key] = pack[key];
    }

    // sort some sub items alphabetically
    ['dependencies', 'devDependencies', 'jshintConfig', 'scripts'].forEach(function (key) {
        if (out[key]) out[key] = sortObjectKeysAlphabetically(out[key]);
    });

    // write it out
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + os.EOL, {encoding: 'utf8'});

    if (log) console.log('package.json'.bold + ' fixed'.green + '!');
};
