const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const {
  httpsRedirect,
  securityMiddleware,
  corsMiddleware,
  csrfProtection,
  generalLimiter,
  errorHandler
} = require('./middleware');
const apiRoutes = require('./routes');
const { UPLOAD_DIR, DATA_DIR } = require('./config');

const app = express();

app.disable('x-powered-by');

const initDirs = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify({
        level: 'fatal',
        message: 'Failed to initialize directories',
        timestamp: new Date().toISOString()
      }));
    } else {
      console.error('Failed to initialize directories:', err.message);
    }
    process.exit(1);
  }
};

app.use(httpsRedirect);
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(csrfProtection);
app.use(express.json({ limit: '10mb' }));

const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));

app.use('/', generalLimiter);
app.use('/', apiRoutes);

app.use((req, res, next) => {
  const apiPrefixes = ['/api/', '/upload', '/download', '/info', '/raw'];
  const isApiRoute = apiPrefixes.some(prefix => req.path.startsWith(prefix));

  if (req.method === 'GET' && !isApiRoute && !req.path.startsWith('/assets/')) {
    const indexPath = path.join(__dirname, '../../public/index.html');
    return res.sendFile(indexPath);
  }

  next();
});

app.use(errorHandler);

module.exports = { app, initDirs };