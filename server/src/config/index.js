const environment = require('./environment');
const constants = require('./constants');
const security = require('./security');

module.exports = {
  ...environment,
  ...constants,
  security
};