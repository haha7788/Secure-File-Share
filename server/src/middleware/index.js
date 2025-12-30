const securityMiddleware = require('./security');
const { corsMiddleware, csrfProtection } = require('./cors');
const { uploadLimiter, downloadLimiter, generalLimiter } = require('./rateLimit');
const httpsRedirect = require('./httpsRedirect');
const { errorHandler, logError } = require('./errorHandler');
const upload = require('./upload');
const passwordAuth = require('./passwordAuth');
const validateExpiry = require('./validateExpiry');

module.exports = {
  securityMiddleware,
  corsMiddleware,
  csrfProtection,
  uploadLimiter,
  downloadLimiter,
  generalLimiter,
  httpsRedirect,
  errorHandler,
  logError,
  upload,
  passwordAuth,
  validateExpiry
};