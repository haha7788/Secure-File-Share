const { Markup } = require('telegraf');
const i18n = require('../locales');
const { getSession } = require('../utils/session');

function getMainKeyboard(userId) {
  const lang = i18n.getUserLang(userId);
  const langButton = lang === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU';

  return Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t(userId, 'buttons.uploadFile'), 'upload_file')],
    [Markup.button.callback(i18n.t(userId, 'buttons.uploadText'), 'upload_text')],
    [Markup.button.callback(i18n.t(userId, 'buttons.download'), 'download')],
    [
      Markup.button.callback(i18n.t(userId, 'buttons.help'), 'help'),
      Markup.button.callback(langButton, 'toggle_language')
    ]
  ]);
}

function getBackKeyboard(userId, backAction = 'main_menu') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t(userId, 'buttons.back'), backAction)]
  ]);
}

function getSettingsKeyboard(userId) {
  const session = getSession(userId);
  const { expiry, password, deleteAfter } = session.uploadSettings;

  const expiryLabel = i18n.t(userId, 'uploadSettings.days')[
    i18n.t(userId, 'uploadSettings.daysValues').indexOf(expiry)
  ];
  const deleteLabel =
    deleteAfter === 0
      ? i18n.t(userId, 'uploadSettings.downloads')[0]
      : `${deleteAfter} ${i18n.t(userId, 'common.downloads')}`;

  return Markup.inlineKeyboard([
    [Markup.button.callback(`${i18n.t(userId, 'uploadSettings.expiry')}: ${expiryLabel}`, 'set_expiry')],
    [Markup.button.callback(`${i18n.t(userId, 'uploadSettings.password')}: ${password ? '✅' : '❌'}`, 'set_password')],
    [Markup.button.callback(`${i18n.t(userId, 'uploadSettings.deleteAfter')}: ${deleteLabel}`, 'set_delete_after')],
    [
      Markup.button.callback(i18n.t(userId, 'buttons.confirm'), 'confirm_upload'),
      Markup.button.callback(i18n.t(userId, 'buttons.cancel'), 'cancel_upload')
    ]
  ]);
}

function getExpiryKeyboard(userId) {
  const days = i18n.t(userId, 'uploadSettings.days');
  const values = i18n.t(userId, 'uploadSettings.daysValues');

  const buttons = days.map((label, index) => [Markup.button.callback(label, `expiry_${values[index]}`)]);
  buttons.push([Markup.button.callback(i18n.t(userId, 'buttons.back'), 'upload_settings')]);

  return Markup.inlineKeyboard(buttons);
}

function getDeleteAfterKeyboard(userId) {
  const downloads = i18n.t(userId, 'uploadSettings.downloads');
  const values = i18n.t(userId, 'uploadSettings.downloadsValues');

  const buttons = downloads.map((label, index) => [Markup.button.callback(label, `delete_${values[index]}`)]);
  buttons.push([Markup.button.callback(i18n.t(userId, 'buttons.back'), 'upload_settings')]);

  return Markup.inlineKeyboard(buttons);
}

function getPasswordKeyboard(userId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t(userId, 'buttons.yes'), 'password_yes')],
    [Markup.button.callback(i18n.t(userId, 'buttons.no'), 'password_no')],
    [Markup.button.callback(i18n.t(userId, 'buttons.back'), 'upload_settings')]
  ]);
}

function getTitleKeyboard(userId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(i18n.t(userId, 'buttons.skip'), 'skip_title')],
    [Markup.button.callback(i18n.t(userId, 'buttons.cancel'), 'cancel_upload')]
  ]);
}

function getSuccessKeyboard(userId, link) {
  const isValidUrl = !link.includes('localhost') && !link.includes('127.0.0.1');

  if (isValidUrl) {
    return Markup.inlineKeyboard([
      [Markup.button.url(i18n.t(userId, 'buttons.copyLink'), link)],
      [Markup.button.callback(i18n.t(userId, 'buttons.mainMenu'), 'main_menu')]
    ]);
  }

  return Markup.inlineKeyboard([[Markup.button.callback(i18n.t(userId, 'buttons.mainMenu'), 'main_menu')]]);
}

module.exports = {
  getMainKeyboard,
  getBackKeyboard,
  getSettingsKeyboard,
  getExpiryKeyboard,
  getDeleteAfterKeyboard,
  getPasswordKeyboard,
  getTitleKeyboard,
  getSuccessKeyboard
};