const axios = require('axios');
const FormData = require('form-data');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function uploadFile(fileStream, filename, settings) {
  const form = new FormData();

  form.append('file', fileStream, {
    filename: filename,
    contentType: 'application/octet-stream'
  });

  form.append('expiry', settings.expiry.toString());
  if (settings.password) {
    form.append('password', settings.password);
  }
  form.append('deleteAfter', settings.deleteAfter.toString());

  const response = await axios.post(`${API_URL}/upload`, form, {
    headers: form.getHeaders()
  });

  return response.data;
}

async function uploadText(title, content, settings) {
  const response = await axios.post(`${API_URL}/upload/text`, {
    title: title || undefined,
    content: content,
    expiry: settings.expiry,
    password: settings.password || undefined,
    deleteAfter: settings.deleteAfter
  });

  return response.data;
}

async function getFileInfo(fileId) {
  const response = await axios.get(`${API_URL}/info/${fileId}`);
  return response.data;
}

async function downloadFile(fileId, password = null) {
  const response = await axios.post(
    `${API_URL}/download/${fileId}`,
    password ? { password } : {},
    { responseType: 'stream' }
  );

  let filename = 'file';
  const contentDisposition = response.headers['content-disposition'];

  if (contentDisposition) {
    const rfc5987Match = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/i);
    if (rfc5987Match) {
      try {
        filename = decodeURIComponent(rfc5987Match[1]);
      } catch (e) {
        console.error('Failed to decode RFC 5987 filename:', e);
      }
    } else {
      const standardMatch = contentDisposition.match(/filename="(.+?)"/);
      if (standardMatch) {
        filename = standardMatch[1];

        if (/[\u0080-\u00FF]/.test(filename)) {
          try {
            filename = Buffer.from(filename, 'binary').toString('utf8');
          } catch (e) {
            console.error('Failed to re-encode filename:', e);
          }
        }
      }
    }
  }

  return {
    stream: response.data,
    filename: filename
  };
}

module.exports = {
  uploadFile,
  uploadText,
  getFileInfo,
  downloadFile
};