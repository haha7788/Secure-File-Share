import { ref, computed, onMounted } from 'vue'

export function useTheme() {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.__THEME__) {
      return window.__THEME__
    }
    const stored = localStorage.getItem('securesfileshare_theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const theme = ref(getInitialTheme())

  const bg = computed(() => theme.value === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white')
  const text = computed(() => theme.value === 'dark' ? 'text-white' : 'text-black')
  const muted = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
  const border = computed(() => theme.value === 'dark' ? 'border-gray-700' : 'border-gray-200')
  const hover = computed(() => theme.value === 'dark' ? 'hover:bg-[#222222]' : 'hover:bg-gray-200')
  const input = computed(() => theme.value === 'dark' ? 'bg-[#151515] border-gray-700' : 'bg-gray-50 border-gray-200')
  const card = computed(() => theme.value === 'dark' ? 'bg-[#151515]' : 'bg-gray-50')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('securesfileshare_theme', theme.value)
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  onMounted(() => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    theme,
    bg,
    text,
    muted,
    border,
    hover,
    input,
    card,
    toggleTheme
  }
}