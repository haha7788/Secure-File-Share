const i18n = require('../locales');

function formatSettingsLabels(userId, settings) {
  const { expiry, deleteAfter } = settings;

  const expiryLabel = i18n.t(userId, 'uploadSettings.days')[
    i18n.t(userId, 'uploadSettings.daysValues').indexOf(expiry)
  ];

  const deleteLabel = deleteAfter === 0
    ? i18n.t(userId, 'uploadSettings.downloads')[0]
    : `${deleteAfter} ${i18n.t(userId, 'common.downloads')}`;

  return { expiryLabel, deleteLabel };
}

function buildSettingsMessage(userId, settings, isText = false) {
  const { expiryLabel, deleteLabel } = formatSettingsLabels(userId, settings);
  const uploadType = isText
    ? i18n.t(userId, 'uploadSettings.uploadingText')
    : i18n.t(userId, 'uploadSettings.uploadingFile');

  return `${i18n.t(userId, 'uploadSettings.title')}:\n\n${uploadType}\n${i18n.t(userId, 'uploadSettings.expiry')}: ${expiryLabel}\n${i18n.t(userId, 'uploadSettings.deleteAfterDownloads')}: ${deleteLabel}`;
}

module.exports = {
  formatSettingsLabels,
  buildSettingsMessage
};