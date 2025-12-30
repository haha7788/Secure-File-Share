export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  THEME: 'securefileshare_theme',
  LANG: 'securefileshare_lang'
};

export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 1024 * 1024 * 1024
};

export const TIMINGS = {
  CLIPBOARD_FEEDBACK_MS: 2000
};

export const ENDPOINTS = {
  UPLOAD: '/upload',
  UPLOAD_TEXT: '/upload/text',
  DOWNLOAD: '/download',
  INFO: '/info',
  VERIFY: '/verify',
  RAW: '/raw'
};