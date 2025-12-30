import { ref, computed, onMounted } from 'vue'
import ru from '../locales/ru.js'
import en from '../locales/en.js'

export function useLocale() {
  const getInitialLang = () => {
    if (typeof window !== 'undefined' && window.__LANG__) {
      return window.__LANG__
    }
    return localStorage.getItem('securefileshare_lang') || 'ru'
  }

  const lang = ref(getInitialLang())
  const translations = { ru, en }
  const t = computed(() => translations[lang.value])

  const toggleLang = () => {
    lang.value = lang.value === 'ru' ? 'en' : 'ru'
    localStorage.setItem('securefileshare_lang', lang.value)
    document.documentElement.lang = lang.value
  }

  onMounted(() => {
    document.documentElement.lang = lang.value
  })

  return {
    lang,
    t,
    toggleLang
  }
}