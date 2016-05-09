'use strict';
const log4js = require("log4js");
log4js.configure(__dirname + '/log4js.json', {cwd: __dirname + '/../log'});
const errLog = log4js.getLogger('error');
const logger = log4js.getLogger('log');

exports.logger = logger;
exports.errLog = errLog;