const { MAX_TEXT_SIZE } = require('../config');

const validateText = (content) => {
  if (!content) {
    throw new Error('No content provided');
  }

  if (Buffer.byteLength(content, 'utf8') > MAX_TEXT_SIZE) {
    throw new Error('Text too large (max 2MB)');
  }

  return true;
};

module.exports = {
  validateText
};