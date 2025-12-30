const i18n = require('../locales');
const { clearSession } = require('../utils/session');
const { getMainKeyboard, getBackKeyboard } = require('../keyboards');

async function handleMainMenu(ctx) {
  const userId = ctx.from.id;
  clearSession(userId);

  await ctx.editMessageText(
    i18n.t(userId, 'welcome.title') + '\n\n' + i18n.t(userId, 'welcome.description') + '\n' + i18n.t(userId, 'welcome.instruction'),
    getMainKeyboard(userId)
  );
}

async function handleHelpAction(ctx) {
  const userId = ctx.from.id;

  await ctx.editMessageText(i18n.t(userId, 'help.content'), {
    parse_mode: 'HTML',
    ...getBackKeyboard(userId)
  });
}

async function handleToggleLanguage(ctx) {
  const userId = ctx.from.id;
  const currentLang = i18n.getUserLang(userId);
  const newLang = currentLang === 'ru' ? 'en' : 'ru';

  i18n.setUserLang(userId, newLang);

  await ctx.answerCbQuery(i18n.t(userId, 'settings.languageChanged'));

  await ctx.editMessageText(
    i18n.t(userId, 'welcome.title') + '\n\n' + i18n.t(userId, 'welcome.description') + '\n' + i18n.t(userId, 'welcome.instruction'),
    getMainKeyboard(userId)
  );
}

module.exports = {
  handleMainMenu,
  handleHelpAction,
  handleToggleLanguage
};