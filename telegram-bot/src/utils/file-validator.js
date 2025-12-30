const i18n = require('../locales');

const MAX_FILE_SIZE = 1024 * 1024 * 1024;
const MAX_TEXT_SIZE = 2 * 1024 * 1024;

async function validateFileSize(ctx, userId, file) {
  if (file.file_size > MAX_FILE_SIZE) {
    await ctx.reply(i18n.t(userId, 'errors.fileTooLarge'));
    return false;
  }
  return true;
}

async function validateTextSize(ctx, userId, text) {
  if (Buffer.byteLength(text, 'utf8') > MAX_TEXT_SIZE) {
    await ctx.reply(i18n.t(userId, 'errors.textTooLarge'));
    return false;
  }
  return true;
}

function extractMediaFile(message) {
  if (message.photo) {
    const photos = message.photo;
    const file = photos[photos.length - 1];
    return { file, fileName: `photo_${Date.now()}.jpg` };
  }

  if (message.video) {
    return {
      file: message.video,
      fileName: message.video.file_name || `video_${Date.now()}.mp4`
    };
  }

  if (message.animation) {
    return {
      file: message.animation,
      fileName: message.animation.file_name || `animation_${Date.now()}.gif`
    };
  }

  if (message.audio) {
    return {
      file: message.audio,
      fileName: message.audio.file_name || `audio_${Date.now()}.mp3`
    };
  }

  if (message.voice) {
    return {
      file: message.voice,
      fileName: `voice_${Date.now()}.ogg`
    };
  }

  if (message.video_note) {
    return {
      file: message.video_note,
      fileName: `video_note_${Date.now()}.mp4`
    };
  }

  return null;
}

module.exports = {
  validateFileSize,
  validateTextSize,
  extractMediaFile,
  MAX_FILE_SIZE,
  MAX_TEXT_SIZE
};