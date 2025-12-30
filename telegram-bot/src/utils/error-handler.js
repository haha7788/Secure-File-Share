const i18n = require('../locales');

function getErrorMessage(error, userId, context = 'download') {
  if (!error.response) {
    return i18n.t(userId, `${context}.error`);
  }

  const status = error.response.status;

  switch (status) {
    case 403:
      return i18n.t(userId, `${context}.incorrectPassword`);
    case 404:
      return i18n.t(userId, `${context}.notFound`);
    case 410:
      return i18n.t(userId, `${context}.expired`);
    case 429:
      return i18n.t(userId, `${context}.tooManyRequests`);
    default:
      return i18n.t(userId, `${context}.error`);
  }
}

module.exports = {
  getErrorMessage
};