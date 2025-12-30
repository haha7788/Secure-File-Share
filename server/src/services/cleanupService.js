const fs = require('fs').promises;
const path = require('path');
const { DATA_DIR } = require('../config');
const { loadMetadata, checkExpiry } = require('./metadataService');
const { deleteFile } = require('./fileService');

const cleanupExpiredFiles = async () => {
  try {
    const files = await fs.readdir(DATA_DIR);
    let cleanedCount = 0;
    for (const file of files) {
      if (file.endsWith('.json')) {
        const id = path.basename(file, '.json');
        const metadata = await loadMetadata(id);
        if (metadata && checkExpiry(metadata.expiryDate)) {
          await deleteFile(id);
          cleanedCount++;
        }
      }
    }
    if (cleanedCount > 0 && process.env.NODE_ENV !== 'production') {
      console.log(`Cleanup: removed ${cleanedCount} expired files`);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Cleanup error:', err.message);
    }
  }
};

const startCleanupScheduler = () => {
  setInterval(cleanupExpiredFiles, 60 * 60 * 1000);
  cleanupExpiredFiles();
};

module.exports = {
  cleanupExpiredFiles,
  startCleanupScheduler
};