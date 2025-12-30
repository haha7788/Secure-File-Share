const rateLimit = require('express-rate-limit');
const config = require('../config');

const uploadLimiter = rateLimit({
  ...config.security.rateLimit.upload,
  standardHeaders: false,
  legacyHeaders: false
});

const downloadLimiter = rateLimit({
  ...config.security.rateLimit.download,
  standardHeaders: false,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  ...config.security.rateLimit.general,
  standardHeaders: false,
  legacyHeaders: false
});

module.exports = {
  uploadLimiter,
  downloadLimiter,
  generalLimiter
};