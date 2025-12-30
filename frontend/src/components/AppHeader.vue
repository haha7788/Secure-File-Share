<template>
  <header :class="[
    'flex justify-between items-center px-6 py-4 border-b transition-colors',
    theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
  ]">
    <a href="/" :class="[
      'text-2xl font-bold transition-colors flex items-center gap-2',
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    ]">
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M18,20H6V4H13V9H18V20M12,12L16,16H13.5V19H10.5V16H8L12,12Z"/>
      </svg>
      {{ translations.appName }}
    </a>
    <div class="flex items-center gap-3">
      <button
        @click="toggleLocale"
        :class="[
          'px-3 py-2 rounded-lg border transition-all font-medium',
          theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
        ]"
      >
        {{ lang === 'ru' ? 'EN' : 'RU' }}
      </button>
      <button
        @click="toggleTheme"
        :class="[
          'px-3 py-2 rounded-lg border transition-all',
          theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
        ]"
      >
        <span v-if="theme === 'dark'">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';
import { useLocale } from '../composables/useLocale';

const { theme, toggleTheme } = useTheme();
const { lang, toggleLocale, t: translations } = useLocale();
</script>