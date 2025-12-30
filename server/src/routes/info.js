const express = require('express');
const router = express.Router();
const { downloadLimiter, logError, validateExpiry, passwordAuth } = require('../middleware');

function buildFileInfo(metadata, includeAllFields = false) {
  const baseInfo = {
    filename: metadata.filename,
    size: metadata.size,
    expiryDate: metadata.expiryDate,
    hasPassword: metadata.hasPassword,
    isText: metadata.isText || false,
    ...(metadata.title && { title: metadata.title })
  };

  if (!includeAllFields) {
    return baseInfo;
  }

  const remainingDownloads = metadata.maxDownloads > 0
    ? Math.max(0, metadata.maxDownloads - metadata.downloads)
    : -1;

  return {
    ...baseInfo,
    mimetype: metadata.mimetype || 'application/octet-stream',
    uploadDate: metadata.uploadDate,
    downloads: metadata.downloads,
    maxDownloads: metadata.maxDownloads,
    remainingDownloads,
    ...(metadata.textStats && { textStats: metadata.textStats })
  };
}

router.get('/:id', downloadLimiter, validateExpiry, async (req, res) => {
  try {
    const { metadata } = req;

    if (metadata.hasPassword) {
      return res.json(buildFileInfo(metadata, false));
    }

    res.json(buildFileInfo(metadata, true));
  } catch (err) {
    logError('Info retrieval failed', err, { fileId: req.params.id });
    res.status(500).json({ error: 'Failed to get info' });
  }
});

router.post('/:id/verify', downloadLimiter, validateExpiry, passwordAuth, async (req, res) => {
  try {
    const { metadata } = req;

    if (!metadata.hasPassword) {
      return res.status(400).json({ error: 'File is not password protected' });
    }

    res.json({
      verified: true,
      ...buildFileInfo(metadata, true)
    });
  } catch (err) {
    logError('Password verification failed', err, { fileId: req.params.id });
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

module.exports = router;