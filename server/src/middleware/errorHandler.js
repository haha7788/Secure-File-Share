const { NODE_ENV } = require('../config');

const logError = (message, error, context = {}) => {
  const sanitized = { ...context };
  delete sanitized.password;
  delete sanitized.passwordHash;
  delete sanitized.content;

  if (NODE_ENV === 'production') {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      context: sanitized,
      timestamp: new Date().toISOString()
    }));
  } else {
    console.error(message, error.message, sanitized);
  }
};

const errorHandler = (err, req, res, next) => {
  const sanitizedBody = { ...req.body };
  delete sanitizedBody.password;
  delete sanitizedBody.content;

  logError('Unhandled error', err, {
    method: req.method,
    path: req.path,
    body: sanitizedBody
  });

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  errorHandler,
  logError
};