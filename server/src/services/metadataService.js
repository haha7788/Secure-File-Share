const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { DATA_DIR } = require('../config');

const generateId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    id += chars[randomIndex];
  }
  return id;
};

const validateId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID format');
  }
  if (!/^[a-zA-Z0-9]{16}$/.test(id)) {
    throw new Error('Invalid ID format');
  }
  return id;
};

const saveMetadata = async (id, metadata) => {
  const metaPath = path.join(DATA_DIR, `${id}.json`);
  await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
};

const loadMetadata = async (id) => {
  try {
    validateId(id);
    const metaPath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.readFile(metaPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const checkExpiry = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  generateId,
  validateId,
  saveMetadata,
  loadMetadata,
  checkExpiry
};