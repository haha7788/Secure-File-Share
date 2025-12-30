const { validateFileExists } = require('../utils/helpers');

async function validateExpiry(req, res, next) {
  const { id } = req.params;
  const { valid, metadata } = await validateFileExists(id, res);

  if (!valid) {
    return res.status(404).json({ error: 'File not found' });
  }

  req.metadata = metadata;
  next();
}

module.exports = validateExpiry;