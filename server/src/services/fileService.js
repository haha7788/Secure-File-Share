const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { DATA_DIR } = require('../config');
const { loadMetadata } = require('./metadataService');

const secureDelete = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;

    for (let pass = 0; pass < 3; pass++) {
      const randomData = crypto.randomBytes(Math.min(fileSize, 1024 * 1024));
      const fd = await fs.open(filePath, 'w');

      try {
        let offset = 0;
        while (offset < fileSize) {
          const chunkSize = Math.min(randomData.length, fileSize - offset);
          await fd.write(randomData, 0, chunkSize, offset);
          offset += chunkSize;
        }
      } finally {
        await fd.close();
      }
    }

    await fs.unlink(filePath);
  } catch (err) {
    try {
      await fs.unlink(filePath);
    } catch (unlinkErr) {
    }
  }
};

const deleteFile = async (id) => {
  try {
    const metadata = await loadMetadata(id);
    if (metadata && metadata.filePath) {
      const absolutePath = path.join(__dirname, '../../', metadata.filePath);
      await secureDelete(absolutePath);
    }

    const metadataPath = path.join(DATA_DIR, `${id}.json`);
    await secureDelete(metadataPath);
  } catch (err) {
  }
};

const getAbsolutePath = (relativePath) => {
  return path.join(__dirname, '../../', relativePath);
};

module.exports = {
  deleteFile,
  getAbsolutePath
};