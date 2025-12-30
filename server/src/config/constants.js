const path = require('path');

module.exports = {
  MAX_FILE_SIZE: 1024 * 1024 * 1024,
  MAX_TEXT_SIZE: 2 * 1024 * 1024,
  FILENAME_MAX_LENGTH: 96,
  UNLIMITED_DOWNLOADS: -1,
  UPLOAD_DIR: path.join(__dirname, '../../uploads'),
  DATA_DIR: path.join(__dirname, '../../data'),

  DANGEROUS_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.sh', '.app', '.com', '.scr', '.vbs', '.jar',
    '.ps1', '.psm1', '.psd1', '.ps1xml', '.psc1',
    '.msi', '.msp', '.mst',
    '.apk', '.ipa',
    '.deb', '.rpm',
    '.dmg', '.pkg',
    '.vb', '.vbe', '.vba', '.vbscript',
    '.ws', '.wsf', '.wsc', '.wsh',
    '.hta',
    '.cpl', '.dll', '.sys', '.drv',
    '.scf', '.lnk', '.inf', '.reg'
  ],

  DANGEROUS_MIME_TYPES: [
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-bat',
    'application/x-sh',
    'application/x-executable',
    'application/vnd.microsoft.portable-executable',
    'application/x-java-archive',
    'application/x-msi',
    'application/vnd.android.package-archive',
    'application/x-deb',
    'application/x-rpm',
    'application/x-apple-diskimage',
    'application/x-sh',
    'text/x-shellscript'
  ]
};