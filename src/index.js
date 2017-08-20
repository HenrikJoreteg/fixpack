import ALCE from 'alce';
import extend from 'extend-object';
import fs from 'fs';
import path from 'path';
import 'colors';
import defaultConfig from './config';

function checkMissing (pack, config) {
  let warnItems;
  let required;
  if (pack.private) {
    warnItems = config.warnOnPrivate
    required = config.requiredOnPrivate
  } else {
    warnItems = config.warn
    required = config.required
  }
  required.forEach(key => {
    if (!pack[key]) throw new Error(`${config.fileName} files must have a ${key}`)
  })
  warnItems.forEach(key => {
    if (!pack[key] && !config.quiet) console.log((`missing ${key}`).yellow)
  })
}

function sortAlphabetically (object) {
  if (Array.isArray(object)) {
    object.sort()
    return object
  } else {
    const sorted = {};
    Object.keys(object).sort().forEach(key => {
      sorted[key] = object[key]
    })
    return sorted
  }
}

export default (file, config) => {
  config = extend(defaultConfig, config || {})
  if (!fs.existsSync(file)) {
    if (!config.quiet) console.log((`No such file: ${file}`).red)
    process.exit(1)
  }
  config.fileName = path.basename(file)
  const original = fs.readFileSync(file, {encoding: 'utf8'});
  let pack = ALCE.parse(original);
  const out = {};
  let outputString = '';
  let key;

  // make sure we have everything
  checkMissing(pack, config)

  // handle the specific ones we want, then remove
  config.sortToTop.forEach(key => {
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
  config.sortedSubItems.forEach(key => {
    if (out[key]) out[key] = sortAlphabetically(out[key])
  })

  // wipe version numbers
  if (config.wipe) {
    const versionedKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    versionedKeys.forEach(key => {
      const depGroup = out[key]
      if (depGroup) {
        for (const item in depGroup) {
          depGroup[item] = '*'
        }
      }
    })
  }

  // write it out
  outputString = `${JSON.stringify(out, null, 2)}\n`

  if (outputString !== original) {
    fs.writeFileSync(file, outputString, {encoding: 'utf8'})
    if (!config.quiet) console.log(`${config.fileName.bold + ' fixed'.green}!`)
  } else {
    if (!config.quiet) console.log(`${config.fileName.bold + ' already clean'.green}!`)
  }
};
