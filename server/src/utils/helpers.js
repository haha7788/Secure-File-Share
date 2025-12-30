const { loadMetadata, deleteFile } = require('../services');
const { checkExpiry } = require('../services/metadataService');

function sanitizeFilename(filename) {
  return filename.replace(/[/\\]/g, '_').replace(/\.\./g, '_');
}

function calculateExpiryDate(expiryDays) {
  const days = parseInt(expiryDays) || 7;
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate;
}

function createContentDisposition(filename) {
  const encodedFilename = encodeURIComponent(filename);
  const utf8Filename = Buffer.from(filename, 'utf8').toString('utf8');
  return `attachment; filename="${utf8Filename}"; filename*=UTF-8''${encodedFilename}`;
}

async function validateFileExists(id, res) {
  const metadata = await loadMetadata(id);

  if (!metadata || checkExpiry(metadata.expiryDate)) {
    if (metadata) {
      await deleteFile(id);
    }
    return { valid: false, metadata: null };
  }

  return { valid: true, metadata };
}

module.exports = {
  sanitizeFilename,
  calculateExpiryDate,
  createContentDisposition,
  validateFileExists
};