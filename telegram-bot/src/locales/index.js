const ru = require('./ru');
const en = require('./en');

const locales = { ru, en };

class Localization {
  constructor() {
    this.userLanguages = new Map();
    this.defaultLanguage = 'ru';
  }

  getUserLang(userId) {
    return this.userLanguages.get(userId) || this.defaultLanguage;
  }

  setUserLang(userId, lang) {
    if (locales[lang]) {
      this.userLanguages.set(userId, lang);
      return true;
    }
    return false;
  }

  t(userId, key, params = {}) {
    const lang = this.getUserLang(userId);
    const keys = key.split('.');
    let value = locales[lang];

    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (_, key) => params[key] || '');
    }

    return value;
  }

  getAvailableLanguages() {
    return Object.keys(locales);
  }

  getLangFlag(lang) {
    const flags = {
      ru: '🇷🇺',
      en: '🇬🇧'
    };
    return flags[lang] || '';
  }
}

module.exports = new Localization();