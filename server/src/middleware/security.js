const helmet = require('helmet');
const config = require('../config');

const securityMiddleware = helmet(config.security.helmet);

module.exports = securityMiddleware;