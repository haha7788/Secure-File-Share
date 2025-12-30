<template>
  <div class="flex items-center justify-center min-h-screen">
    <div :class="[
      'animate-spin rounded-full h-12 w-12 border-b-2',
      theme === 'dark' ? 'border-white' : 'border-gray-900'
    ]"></div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { theme } = useTheme();
</script>