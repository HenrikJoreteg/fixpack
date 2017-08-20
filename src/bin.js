import path from 'path';
import rc from 'rc';
import defaultConfig from './config.json';
import fixpack from './index';

const config = rc('fixpack', defaultConfig);
const files = config._;

if (files.length) {
  config.files = files
}

config.files.forEach(file => {
  fixpack(path.resolve(file), config)
})
