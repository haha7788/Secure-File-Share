const i18n = require('../locales');
const { getSession, clearSession, setState } = require('../utils/session');
const {
  getSettingsKeyboard,
  getExpiryKeyboard,
  getDeleteAfterKeyboard,
  getPasswordKeyboard,
  getTitleKeyboard,
  getSuccessKeyboard,
  getBackKeyboard
} = require('../keyboards');
const { uploadFile, uploadText } = require('../services/api');
const { formatBytes, formatDate, buildFileUrl, escapeHtml, escapeFilename } = require('../utils/helpers');
const { validateFileSize, extractMediaFile, MAX_TEXT_SIZE } = require('../utils/file-validator');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function handleUploadFile(ctx) {
  const userId = ctx.from.id;
  setState(userId, 'awaiting_file');
  await ctx.editMessageText(i18n.t(userId, 'upload.sendFile'), getBackKeyboard(userId));
}

async function handleUploadText(ctx) {
  const userId = ctx.from.id;
  setState(userId, 'awaiting_text_title');
  await ctx.editMessageText(i18n.t(userId, 'upload.askTitle'), getTitleKeyboard(userId));
}

async function handleDocument(ctx) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  if (session.state !== 'awaiting_file') return;

  const file = ctx.message.document;

  if (!(await validateFileSize(ctx, userId, file))) return;

  session.tempFile = file;
  setState(userId, 'configuring_upload');
  await showUploadSettings(ctx, userId);
}

async function handleMedia(ctx) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  if (session.state !== 'awaiting_file') return;

  const media = extractMediaFile(ctx.message);
  if (!media) return;

  const { file, fileName } = media;

  if (!(await validateFileSize(ctx, userId, file))) return;

  session.tempFile = { ...file, file_name: fileName };
  setState(userId, 'configuring_upload');
  await showUploadSettings(ctx, userId);
}

async function handleTextInput(ctx) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  if (session.state === 'awaiting_text_title') {
    if (ctx.message.text.startsWith('/')) return;

    session.tempTitle = ctx.message.text;
    setState(userId, 'awaiting_text_content');

    await ctx.reply(i18n.t(userId, 'upload.sendText'), getBackKeyboard(userId, 'cancel_upload'));
  } else if (session.state === 'awaiting_text_content') {
    if (ctx.message.text.startsWith('/')) return;

    if (Buffer.byteLength(ctx.message.text, 'utf8') > MAX_TEXT_SIZE) {
      await ctx.reply(i18n.t(userId, 'errors.textTooLarge'));
      return;
    }

    session.tempText = ctx.message.text;
    setState(userId, 'configuring_upload');
    await showUploadSettings(ctx, userId);
  } else if (session.state === 'awaiting_password') {
    session.uploadSettings.password = ctx.message.text;
    setState(userId, 'configuring_upload');
    await ctx.reply(i18n.t(userId, 'upload.passwordSet'), getSettingsKeyboard(userId));
  }
}

async function showUploadSettings(ctx, userId, isEdit = false) {
  const session = getSession(userId);
  const { expiry, password, deleteAfter } = session.uploadSettings;

  const isText = !!session.tempText || (session.state === 'awaiting_text_content');
  const configureKey = isText ? 'uploadSettings.configureText' : 'uploadSettings.configure';

  const expiryLabel = i18n.t(userId, 'uploadSettings.days')[i18n.t(userId, 'uploadSettings.daysValues').indexOf(expiry)];
  const deleteLabel =
    deleteAfter === 0 ? i18n.t(userId, 'uploadSettings.downloads')[0] : `${deleteAfter} ${i18n.t(userId, 'common.downloads')}`;

  const message = i18n.t(userId, configureKey) +
    '\n\n' +
    i18n.t(userId, 'uploadSettings.currentSettings', {
      expiry: expiryLabel,
      password: password ? i18n.t(userId, 'common.protected') : i18n.t(userId, 'common.no'),
      deleteAfter: deleteLabel
    });

  const options = { parse_mode: 'HTML', ...getSettingsKeyboard(userId) };

  if (isEdit) {
    await ctx.editMessageText(message, options);
  } else {
    await ctx.reply(message, options);
  }
}

async function handleSkipTitle(ctx) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  session.tempTitle = null;
  setState(userId, 'awaiting_text_content');

  await ctx.editMessageText(
    i18n.t(userId, 'upload.sendText'),
    getBackKeyboard(userId, 'cancel_upload')
  );
}

async function handleUploadSettings(ctx) {
  const userId = ctx.from.id;
  await ctx.answerCbQuery();
  await showUploadSettings(ctx, userId, true);
}

async function handleSetExpiry(ctx) {
  const userId = ctx.from.id;
  await ctx.editMessageText(i18n.t(userId, 'uploadSettings.expiry'), getExpiryKeyboard(userId));
}

async function handleExpiryValue(ctx, value) {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.uploadSettings.expiry = parseInt(value);

  await ctx.answerCbQuery(i18n.t(userId, 'common.done'));
  await showUploadSettings(ctx, userId, true);
}

async function handleSetPassword(ctx) {
  const userId = ctx.from.id;
  await ctx.editMessageText(i18n.t(userId, 'uploadSettings.password'), getPasswordKeyboard(userId));
}

async function handlePasswordValue(ctx, value) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  if (value === 'yes') {
    setState(userId, 'awaiting_password');
    await ctx.editMessageText(i18n.t(userId, 'upload.setPassword'), getBackKeyboard(userId));
  } else {
    session.uploadSettings.password = null;
    setState(userId, 'configuring_upload');
    await ctx.answerCbQuery(i18n.t(userId, 'common.done'));
    await showUploadSettings(ctx, userId, true);
  }
}

async function handlePasswordYes(ctx) {
  await handlePasswordValue(ctx, 'yes');
}

async function handlePasswordNo(ctx) {
  await handlePasswordValue(ctx, 'no');
}

async function handleSetDeleteAfter(ctx) {
  const userId = ctx.from.id;
  await ctx.editMessageText(i18n.t(userId, 'uploadSettings.deleteAfterDownloads'), getDeleteAfterKeyboard(userId));
}

async function handleDeleteAfterValue(ctx, value) {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.uploadSettings.deleteAfter = parseInt(value);

  await ctx.answerCbQuery(i18n.t(userId, 'common.done'));
  await showUploadSettings(ctx, userId, true);
}

async function handleConfirmUpload(ctx) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  try {
    const { expiry, password, deleteAfter } = session.uploadSettings;

    let isText = false;
    if (session.tempFile && session.tempFile.file_id) {
      isText = false;
    } else if (session.tempText) {
      isText = true;
    }

    let result;

    if (isText) {
      result = await uploadText({
        title: session.tempTitle || '',
        content: session.tempText,
        expiry,
        password: password || '',
        deleteAfter: deleteAfter
      });
    } else {
      const file = session.tempFile;
      const fileUrl = await ctx.telegram.getFileLink(file.file_id);
      const fileName = file.file_name || `file_${Date.now()}`;

      result = await uploadFile({
        fileUrl: fileUrl.href,
        filename: fileName,
        expiry,
        password: password || '',
        deleteAfter: deleteAfter
      });
    }

    const { id, expiryDate } = result;
    const url = buildFileUrl(id, isText);

    const successMessage = isText
      ? i18n.t(userId, 'upload.textSuccess')
      : i18n.t(userId, 'upload.fileSuccess');

    const expiryDateStr = formatDate(expiryDate, userId);

    let messageText = `${successMessage}\n\n<b>${i18n.t(userId, 'common.link')}:</b> ${url}\n<b>${i18n.t(userId, 'common.expiryDate')}:</b> ${escapeHtml(expiryDateStr)}`;

    if (!isText && session.tempFile) {
      const fileSize = session.tempFile.file_size || 0;
      const fileName = session.tempFile.file_name || '';
      messageText += `\n<b>${i18n.t(userId, 'common.filename')}:</b> ${escapeFilename(fileName)}\n<b>${i18n.t(userId, 'common.size')}:</b> ${formatBytes(fileSize)}`;
    }

    await ctx.editMessageText(messageText, { parse_mode: 'HTML', ...getSuccessKeyboard(userId, url) });

    clearSession(userId);
  } catch (error) {
    console.error('Upload failed:', error);
    await ctx.editMessageText(i18n.t(userId, 'errors.uploadFailed'), getBackKeyboard(userId));
  }
}

async function handleCancelUpload(ctx) {
  const userId = ctx.from.id;
  clearSession(userId);
  await ctx.editMessageText(i18n.t(userId, 'upload.cancelled'), getBackKeyboard(userId));
}

module.exports = {
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
};