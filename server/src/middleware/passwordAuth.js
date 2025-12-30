const bcrypt = require('bcrypt');
const { logError } = require('./errorHandler');

async function passwordAuth(req, res, next) {
  if (!req.metadata.hasPassword) {
    return next();
  }

  const password = req.body?.password || req.query?.password;

  if (!password) {
    return res.status(401).json({ error: 'Password required' });
  }

  const passwordValid = await bcrypt.compare(password, req.metadata.passwordHash);

  if (!passwordValid) {
    logError('Invalid password attempt', new Error('Authentication failed'), { fileId: req.params.id });
    return res.status(403).json({ error: 'Invalid password' });
  }

  next();
}

module.exports = passwordAuth;