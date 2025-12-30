require('dotenv').config();
const { Telegraf } = require('telegraf');
const i18n = require('./locales');
const fs = require('fs');
const path = require('path');

const { handleStart } = require('./handlers/commands');
const { handleMainMenu, handleHelpAction, handleToggleLanguage } = require('./handlers/actions');
const {
  handleUploadFile,
  handleUploadText,
  handleDocument,
  handleMedia,
  handleTextInput,
  handleSkipTitle,
  handleUploadSettings,
  handleSetExpiry,
  handleExpiryValue,
  handleSetPassword,
  handlePasswordYes,
  handlePasswordNo,
  handleSetDeleteAfter,
  handleDeleteAfterValue,
  handleConfirmUpload,
  handleCancelUpload
} = require('./handlers/upload');
const { handleDownload, handleDownloadLink, handleDownloadPassword } = require('./handlers/download');

const { getState } = require('./utils/session');

const bot = new Telegraf(process.env.BOT_TOKEN);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:3000';

bot.command('start', handleStart);

bot.action('main_menu', handleMainMenu);
bot.action('help', handleHelpAction);
bot.action('toggle_language', handleToggleLanguage);

bot.action('upload_file', handleUploadFile);
bot.action('upload_text', handleUploadText);
bot.action('skip_title', handleSkipTitle);
bot.action('upload_settings', handleUploadSettings);
bot.action('set_expiry', handleSetExpiry);
bot.action(/expiry_(\d+)/, (ctx) => handleExpiryValue(ctx, ctx.match[1]));
bot.action('set_password', handleSetPassword);
bot.action('password_yes', handlePasswordYes);
bot.action('password_no', handlePasswordNo);
bot.action('set_delete_after', handleSetDeleteAfter);
bot.action(/delete_(\d+)/, (ctx) => handleDeleteAfterValue(ctx, ctx.match[1]));
bot.action('confirm_upload', handleConfirmUpload);
bot.action('cancel_upload', handleCancelUpload);

bot.action('download', handleDownload);

bot.on('document', handleDocument);

bot.on('photo', handleMedia);
bot.on('video', handleMedia);
bot.on('animation', handleMedia);
bot.on('audio', handleMedia);
bot.on('voice', handleMedia);

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const state = getState(userId);
  const text = ctx.message.text;

  if (state === 'awaiting_text_title' || state === 'awaiting_text_content' || state === 'awaiting_password') {
    await handleTextInput(ctx);
  } else if (state === 'awaiting_download_link') {
    await handleDownloadLink(ctx, text.trim());
  } else if (state === 'awaiting_download_password') {
    await handleDownloadPassword(ctx, text);
  }
});

bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  const userId = ctx.from?.id;

  if (userId) {
    ctx
      .reply(i18n.t(userId, 'errors.unknown'), {
        reply_markup: {
          inline_keyboard: [[{ text: i18n.t(userId, 'buttons.mainMenu'), callback_data: 'main_menu' }]]
        }
      })
      .catch(console.error);
  }
});

bot
  .launch()
  .then(() => {
    console.log('✅ SecureFileShare Telegram Bot started');
    console.log(`📡 API URL: ${API_URL}`);
    console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  })
  .catch((err) => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });

const TEMP_DIR = path.join(__dirname, '../temp');
const MAX_TEMP_FILE_AGE = 60 * 60 * 1000;

function cleanupTempFiles() {
  try {
    if (!fs.existsSync(TEMP_DIR)) {
      return;
    }

    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    let cleanedCount = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);

      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > MAX_TEMP_FILE_AGE) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      } catch (err) {
        console.error(`Failed to cleanup temp file ${file}:`, err);
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old temp files`);
    }
  } catch (err) {
    console.error('Temp file cleanup error:', err);
  }
}

cleanupTempFiles();

setInterval(cleanupTempFiles, 60 * 60 * 1000);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;