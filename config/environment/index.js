'use strict';

const path = require('path');
const _ = require('lodash');
const env = process.env.NODE_ENV || 'development';
// Base config
const base = {
  env: env,
  root: path.normalize(__dirname + '/../..'),
  port: process.env.PORT || 3000,
  logLevel : {
     error: 'ERROR',
     logger: 'INFO',
     biz: 'INFO',
     params: 'INFO'
  }
};

// Overide base config with environment
module.exports = _.merge(base, require('./' + env + '.js') || {});