const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs').promises;
const { upload, uploadLimiter, logError } = require('../middleware');
const { generateId, saveMetadata } = require('../services');
const { validateText } = require('../validators');
const { validateContentType } = require('../validators/contentTypeValidator');
const { FRONTEND_URL, UPLOAD_DIR, security, FILENAME_MAX_LENGTH } = require('../config');
const { sanitizeFilename, calculateExpiryDate } = require('../utils/helpers');

function fixFilenameEncoding(originalName) {
  if (/[\u0080-\u00FF]/.test(originalName)) {
    try {
      return Buffer.from(originalName, 'binary').toString('utf8');
    } catch (e) {
      return originalName;
    }
  }
  return originalName;
}

async function hashPassword(password) {
  return password ? await bcrypt.hash(password, security.bcrypt.saltRounds) : null;
}

function buildUploadResponse(id, type, expiryDate, req) {
  const frontendUrl = FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  return {
    success: true,
    id,
    url: `${frontendUrl}/${type}/${id}`,
    expiryDate: expiryDate.toISOString()
  };
}

router.post('/', uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    const { expiry, password, deleteAfter } = req.body;
    const id = generateId();

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    let filename = sanitizeFilename(fixFilenameEncoding(req.file.originalname));

    if (filename.length > FILENAME_MAX_LENGTH) {
      return res.status(400).json({ error: `Filename too long (max ${FILENAME_MAX_LENGTH} characters)` });
    }

    try {
      await validateContentType(req.file.path, req.file.mimetype);
    } catch (err) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'File type not allowed' });
    }

    const expiryDate = calculateExpiryDate(expiry);
    const now = new Date();

    const metadata = {
      id,
      filename,
      filePath: path.relative(path.join(__dirname, '../../'), req.file.path),
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      downloads: 0,
      maxDownloads: parseInt(deleteAfter) || 0,
      hasPassword: !!password
    };

    const passwordHash = await hashPassword(password);
    if (passwordHash) {
      metadata.passwordHash = passwordHash;
    }

    await saveMetadata(id, metadata);

    res.json(buildUploadResponse(id, 'file', expiryDate, req));
  } catch (err) {
    logError('Upload failed', err, { fileSize: req.file?.size, mimetype: req.file?.mimetype });
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/text', uploadLimiter, async (req, res) => {
  try {
    const { title, content, expiry, password, deleteAfter } = req.body;
    const id = generateId();

    validateText(content);

    const sanitizedTitle = title ? sanitizeFilename(title) : null;

    if (sanitizedTitle && sanitizedTitle.length > FILENAME_MAX_LENGTH) {
      return res.status(400).json({ error: `Title too long (max ${FILENAME_MAX_LENGTH} characters)` });
    }

    const expiryDate = calculateExpiryDate(expiry);
    const now = new Date();

    const filename = (sanitizedTitle || 'text') + '.txt';
    const filePath = path.join(UPLOAD_DIR, `${id}.txt`);
    await fs.writeFile(filePath, content, 'utf8');

    const lineCount = (content.match(/\n/g) || []).length + 1;
    const charCount = content.length;

    const metadata = {
      id,
      filename,
      title: sanitizedTitle || null,
      filePath: path.relative(path.join(__dirname, '../../'), filePath),
      size: Buffer.byteLength(content, 'utf8'),
      mimetype: 'text/plain',
      isText: true,
      uploadDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      downloads: 0,
      maxDownloads: parseInt(deleteAfter) || 0,
      hasPassword: !!password,
      textStats: {
        lineCount,
        charCount
      }
    };

    const passwordHash = await hashPassword(password);
    if (passwordHash) {
      metadata.passwordHash = passwordHash;
    }

    await saveMetadata(id, metadata);

    res.json(buildUploadResponse(id, 'text', expiryDate, req));
  } catch (err) {
    if (err.message === 'No content provided' || err.message === 'Text too large (max 2MB)') {
      return res.status(400).json({ error: err.message });
    }
    logError('Text upload failed', err, { contentSize: req.body?.content ? Buffer.byteLength(req.body.content, 'utf8') : 0 });
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;