const express = require('express');
const router = express.Router();
const { downloadLimiter, logError, validateExpiry, passwordAuth } = require('../middleware');
const { getAbsolutePath } = require('../services');
const { validateId } = require('../services/metadataService');

const handleRawRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { metadata } = req;

    try {
      validateId(id);
    } catch (err) {
      return res.status(400).type('text/plain').send('400 - Invalid ID format');
    }

    if (!metadata.isText) {
      return res.status(400).type('text/plain').send('Raw view is only available for text files');
    }

    const absolutePath = getAbsolutePath(metadata.filePath);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    res.sendFile(absolutePath);
  } catch (err) {
    logError('Raw view failed', err, { fileId: req.params.id });
    res.status(500).type('text/plain').send('500 - Raw view failed');
  }
};

router.get('/:id', downloadLimiter, validateExpiry, passwordAuth, handleRawRequest);
router.post('/:id', downloadLimiter, validateExpiry, passwordAuth, handleRawRequest);

module.exports = router;