const metadataService = require('./metadataService');
const fileService = require('./fileService');
const cleanupService = require('./cleanupService');

module.exports = {
  ...metadataService,
  ...fileService,
  ...cleanupService
};