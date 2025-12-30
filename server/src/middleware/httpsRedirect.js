const { NODE_ENV } = require('../config');

const httpsRedirect = (req, res, next) => {
  if (NODE_ENV === 'production') {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = httpsRedirect;