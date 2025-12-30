const i18n = require('../locales');
const { getMainKeyboard } = require('../keyboards');
const { clearSession } = require('../utils/session');

async function handleStart(ctx) {
  const userId = ctx.from.id;
  clearSession(userId);

  await ctx.reply(
    i18n.t(userId, 'welcome.title') + '\n\n' + i18n.t(userId, 'welcome.description') + '\n' + i18n.t(userId, 'welcome.instruction'),
    getMainKeyboard(userId)
  );
}

module.exports = {
  handleStart
};