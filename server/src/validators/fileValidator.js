const path = require('path');
const { DANGEROUS_EXTENSIONS, DANGEROUS_MIME_TYPES } = require('../config');

const validateFile = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new Error('File type not allowed');
  }

  if (DANGEROUS_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    throw new Error('File type not allowed');
  }

  return true;
};

module.exports = {
  validateFile
};