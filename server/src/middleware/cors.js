const cors = require('cors');
const { ALLOWED_ORIGINS } = require('../config');

const corsMiddleware = cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }

  const userAgent = req.get('User-Agent') || '';
  const isProgrammaticClient = !userAgent.includes('Mozilla') && !userAgent.includes('Chrome');

  if (isProgrammaticClient) {
    return next();
  }

  const requestedWith = req.get('X-Requested-With');
  const origin = req.get('Origin');
  const referer = req.get('Referer');

  if (requestedWith === 'XMLHttpRequest') {
    return next();
  }

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return next();
  }

  if (referer) {
    const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => referer.startsWith(allowedOrigin));
    if (isAllowed) {
      return next();
    }
  }

  return res.status(403).json({ error: 'CSRF protection: Invalid request origin' });
};

module.exports = {
  corsMiddleware,
  csrfProtection
};