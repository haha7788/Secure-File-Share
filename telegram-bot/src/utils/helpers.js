function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow'
  });
}

function extractFileId(input) {
  let match = input.match(/\/(file|text)\/([a-zA-Z0-9]{16})$/);
  if (match) return { id: match[2], type: match[1] };

  match = input.match(/\/([a-zA-Z0-9]{16})$/);
  if (match) return { id: match[1], type: null };

  if (/^[a-zA-Z0-9]{16}$/.test(input)) {
    return { id: input, type: null };
  }

  return null;
}

function buildFileUrl(baseUrl, id, isText) {
  const type = isText ? 'text' : 'file';
  return `${baseUrl}/${type}/${id}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeFilename(text) {
  return escapeHtml(text);
}

function getTimeRemaining(expiryDateString, lang = 'ru') {
  const now = new Date();
  const expiry = new Date(expiryDateString);
  const diff = expiry - now;

  if (diff <= 0) {
    return lang === 'ru' ? 'истёк' : 'expired';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (lang === 'ru') {
    if (days > 0) {
      const dayWord = days === 1 ? 'день' : days < 5 ? 'дня' : 'дней';
      parts.push(`${days} ${dayWord}`);
    }
    if (remainingHours > 0) {
      const hourWord = remainingHours === 1 ? 'час' : remainingHours < 5 ? 'часа' : 'часов';
      parts.push(`${remainingHours} ${hourWord}`);
    }
    if (remainingMinutes > 0) {
      const minWord = remainingMinutes === 1 ? 'минута' : remainingMinutes < 5 ? 'минуты' : 'минут';
      parts.push(`${remainingMinutes} ${minWord}`);
    }
    if (days === 0 && remainingHours === 0 && remainingSeconds > 0) {
      const secWord = remainingSeconds === 1 ? 'секунда' : remainingSeconds < 5 ? 'секунды' : 'секунд';
      parts.push(`${remainingSeconds} ${secWord}`);
    }
  } else {
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours > 1 ? 's' : ''}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`);
    if (days === 0 && remainingHours === 0 && remainingSeconds > 0) {
      parts.push(`${remainingSeconds} sec${remainingSeconds > 1 ? 's' : ''}`);
    }
  }

  return parts.join(' ') || (lang === 'ru' ? 'менее минуты' : 'less than a minute');
}

module.exports = {
  formatBytes,
  formatDate,
  extractFileId,
  buildFileUrl,
  escapeHtml,
  escapeFilename,
  getTimeRemaining
};