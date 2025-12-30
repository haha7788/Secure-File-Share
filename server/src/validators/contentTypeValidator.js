const { fileTypeFromFile } = require('file-type');

const validateContentType = async (filePath, clientMimetype) => {
  try {
    const fileType = await fileTypeFromFile(filePath);

    if (!fileType) {
      return true;
    }

    const dangerousMimes = [
      'application/x-msdownload',
      'application/x-executable',
      'application/x-dosexec',
      'application/vnd.microsoft.portable-executable',
      'application/x-mach-binary',
      'application/x-elf'
    ];

    if (dangerousMimes.includes(fileType.mime)) {
      throw new Error('Dangerous file type detected');
    }

    return true;
  } catch (err) {
    if (err.message === 'Dangerous file type detected') {
      throw err;
    }
    return true;
  }
};

module.exports = {
  validateContentType
};