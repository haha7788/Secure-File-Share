<template>
  <footer :class="[
    'mt-8 py-4 text-center border-t transition-colors',
    theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-white border-gray-200 text-gray-600'
  ]">
    <p class="text-sm">
      {{ new Date().getFullYear() }} {{ translations.appName }}. {{ translations.footer }}
    </p>
  </footer>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';
import { useLocale } from '../composables/useLocale';

const { theme } = useTheme();
const { t: translations } = useLocale();
</script>