#!/usr/bin/env node
var fs = require('fs');
var required = ['name', 'version'];
var warnList = ['description', 'author', 'repository', 'keywords', 'main', 'bugs', 'homepage', 'license'];
var privateWarnList = ['description', 'main'];
var ALCE = require('alce');
require('colors');


function checkMissing(pack, log) {
    var warnItems = pack.private ? privateWarnList : warnList;
    required.forEach(function (key) {
        if (!pack[key]) throw new Error('package.json files must have a ' + key);
    });
    warnItems.forEach(function (key) {
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
    if (!fs.existsSync(file)) {
        console.log(('No such file: ' + file).red);
        process.exit(1);
    }
    var pack = ALCE.parse(fs.readFileSync(file, {encoding: 'utf8'}));
    var out = {};
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
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', {encoding: 'utf8'});

    if (log) console.log('package.json'.bold + ' fixed'.green + '!');
};
