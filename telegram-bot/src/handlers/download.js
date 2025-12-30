const fs = require('fs');
const path = require('path');
const i18n = require('../locales');
const { getSession, clearSession, setState } = require('../utils/session');
const { getBackKeyboard } = require('../keyboards');
const { getFileInfo, downloadFile } = require('../services/api');
const { extractFileId, formatBytes, getTimeRemaining } = require('../utils/helpers');
const { getErrorMessage } = require('../utils/error-handler');

async function handleDownload(ctx) {
  const userId = ctx.from.id;
  setState(userId, 'awaiting_download_link');
  await ctx.editMessageText(i18n.t(userId, 'download.enterLink'), getBackKeyboard(userId));
}

async function handleDownloadLink(ctx, input) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  const fileData = extractFileId(input);

  if (!fileData || !fileData.id) {
    await ctx.reply(i18n.t(userId, 'download.invalidLink'));
    return;
  }

  const msg = await ctx.reply(i18n.t(userId, 'download.processing'));

  try {
    const info = await getFileInfo(fileData.id);
    const userLang = i18n.getUserLang(userId);
    const isText = fileData.type === 'text';

    const timeRemaining = getTimeRemaining(info.expiryDate, userLang);
    const maxDownloads = info.maxDownloads || 0;
    const remainingDownloads = maxDownloads > 0 ? maxDownloads - info.downloads : '∞';

    const templateKey = isText ? 'download.textInfo' : 'download.fileInfo';
    const templateParams = {
      timeRemaining,
      remainingDownloads,
      ...(! isText && { filename: info.filename, size: formatBytes(info.size) })
    };

    const fileInfo = i18n.t(userId, templateKey, templateParams);

    session.tempFile = {
      id: fileData.id,
      type: fileData.type,
      hasPassword: info.hasPassword,
      info
    };

    if (info.hasPassword) {
      setState(userId, 'awaiting_download_password');
      await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, fileInfo + '\n\n' + i18n.t(userId, 'download.requiresPassword'), {
        parse_mode: 'HTML',
        ...getBackKeyboard(userId, 'download')
      });
    } else {
      await performDownload(ctx, userId, fileData.id, fileData.type, info, null, msg.message_id);
    }
  } catch (error) {
    const errorMsg = getErrorMessage(error, userId, 'download');
    await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, errorMsg, getBackKeyboard(userId, 'download'));
    clearSession(userId);
  }
}

async function handleDownloadPassword(ctx, password) {
  const userId = ctx.from.id;
  const session = getSession(userId);

  const { id, type, info } = session.tempFile;
  const msg = await ctx.reply(i18n.t(userId, 'download.downloading'));

  await performDownload(ctx, userId, id, type, info, password, msg.message_id);
}

async function performDownload(ctx, userId, fileId, fileType, fileInfo, password, messageId) {
  let tempPath = null;

  try {
    const { stream, filename } = await downloadFile(fileId, password);

    const isText = fileType === 'text';
    const actualFilename = isText ? `${fileId}.txt` : filename;

    tempPath = path.join(__dirname, '../../temp', `${fileId}_${Date.now()}`);

    const tempDir = path.dirname(tempPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const writer = fs.createWriteStream(tempPath);
    stream.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    if (isText && fileInfo.title) {
      const fileContent = fs.readFileSync(tempPath, 'utf8');
      const newContent = `${fileInfo.title}\n\n${fileContent}`;
      fs.writeFileSync(tempPath, newContent, 'utf8');
    }

    await ctx.telegram.editMessageText(ctx.chat.id, messageId, null, i18n.t(userId, 'download.success'));

    const currentDownloads = fileInfo.downloads + 1;
    const maxDownloads = fileInfo.maxDownloads || 0;
    const remainingDownloads = maxDownloads > 0 ? maxDownloads - currentDownloads : '∞';

    const userLang = i18n.getUserLang(userId);
    const timeRemaining = getTimeRemaining(fileInfo.expiryDate, userLang);

    let caption = `⏰ ${i18n.t(userId, 'download.expiresIn')}: ${timeRemaining}\n⬇️ ${i18n.t(userId, 'download.downloadsLeft')}: ${remainingDownloads}`;
    if (!isText) {
      caption = `📄 ${actualFilename}\n${caption}`;
    }

    await ctx.replyWithDocument(
      { source: tempPath, filename: actualFilename },
      { caption, ...getBackKeyboard(userId) }
    );

    clearSession(userId);
  } catch (error) {
    const errorMsg = getErrorMessage(error, userId, 'download');

    if (error.response?.status === 403) {
      setState(userId, 'awaiting_download_password');
    } else {
      clearSession(userId);
    }

    await ctx.telegram.editMessageText(ctx.chat.id, messageId, null, errorMsg, getBackKeyboard(userId, 'download'));
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (err) {
        console.error('Failed to cleanup temp file:', tempPath, err);
      }
    }
  }
}

module.exports = {
  handleDownload,
  handleDownloadLink,
  handleDownloadPassword
};