<template>
  <div class="min-h-screen transition-colors duration-300" :class="bg">
    <header class="max-w-3xl mx-auto px-6 pt-6 pb-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold" :class="text">{{ t.title }}</router-link>
        <div class="flex items-center gap-2">
          <button
            @click="toggleLang"
            :class="['px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium', border, hover]"
          >
            <Globe :size="16" />
            <span>{{ t.langBtn }}</span>
          </button>
          <button
            @click="toggleTheme"
            :class="['px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium', border, hover]"
          >
            <Moon v-if="theme === 'dark'" :size="16" />
            <Sun v-else :size="16" />
            <span>{{ theme === 'dark' ? t.themeBtn : t.themeBtnLight }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 pt-8 pb-20">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2" :class="theme === 'dark' ? 'border-white' : 'border-gray-900'"></div>
        <p class="mt-4" :class="muted">{{ t.loadingInfo }}</p>
      </div>

      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div :class="['rounded-2xl p-10 shadow-sm border max-w-md w-full text-center', card, border]">
          <div :class="['w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center', theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500']">
            <FileType :size="40" />
          </div>
          <p :class="['text-lg font-semibold mb-6', text]">{{ error }}</p>
          <router-link
            to="/"
            :class="[
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-sm',
              theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ t.backHome }}
          </router-link>
        </div>
      </div>

      <div v-else-if="textInfo">
        <div v-if="!textContent || textInfo.hasPassword" :class="['rounded-2xl p-8 mb-6 shadow-sm border', card, border]">
          <div class="text-center mb-6">
            <div :class="['w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
              <FileType :size="40" />
            </div>
            <h2 class="text-2xl font-bold mb-2 break-words px-4" :class="text">{{ textInfo.filename ? textInfo.filename.replace('.txt', '') : t.textDefault }}</h2>
            <p :class="['text-sm', muted]">{{ formatBytes(textInfo.size) }} • {{ t.expiresIn }} {{ getTimeRemaining(textInfo.expiryDate, lang) }}</p>
            <p v-if="textInfo.hasPassword" class="text-yellow-500 text-sm mt-2 flex items-center justify-center gap-2">
              <Lock :size="16" />
              {{ t.passwordProtected }}
            </p>
          </div>

          <div v-if="textInfo.hasPassword && !passwordVerified" class="mb-6">
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t.passwordPlaceholder"
                :class="[
                  'w-full px-4 py-3 pr-12 rounded-xl border transition-all text-sm',
                  theme === 'dark'
                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-white'
                    : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-gray-900'
                ]"
                style="outline: none; box-shadow: none;"
                @keyup.enter="fetchText"
              />
              <button
                @click="showPassword = !showPassword"
                type="button"
                :class="['absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors', muted, hover]"
              >
                <Eye v-if="showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <p v-if="fetchError" class="text-red-500 text-xs mt-2">{{ fetchError }}</p>
          </div>

          <button
            v-if="textInfo.hasPassword && !textContent"
            @click="fetchText"
            :disabled="fetching || !password"
            :class="[
              'w-full px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-sm',
              theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            ]"
          >
            {{ fetching ? t.loading : t.viewText }}
          </button>
        </div>

        <div v-if="textContent" :class="['rounded-2xl p-8 mb-6 shadow-sm border', card, border]">
          <div class="flex items-center justify-between mb-6 pb-4 border-b" :class="border">
            <h3 class="text-lg font-bold break-words flex-1 mr-4" :class="text">
              {{ textInfo.filename ? textInfo.filename.replace('.txt', '') : t.textDefault }}
            </h3>
            <div class="flex items-center gap-2">
              <button
                @click="copyLink"
                :class="[
                  'p-2.5 rounded-lg transition-all',
                  linkCopied
                    ? (theme === 'dark' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700')
                    : `border ${border} ${hover}`
                ]"
                :title="t.copyLinkTitle"
              >
                <Check v-if="linkCopied" :size="18" />
                <Link v-else :size="18" />
              </button>
              <button
                @click="copyText"
                :class="[
                  'p-2.5 rounded-lg transition-all',
                  copied
                    ? (theme === 'dark' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700')
                    : `border ${border} ${hover}`
                ]"
                :title="t.copyTextTitle"
              >
                <Check v-if="copied" :size="18" />
                <Copy v-else :size="18" />
              </button>
              <button
                @click="downloadAsFile"
                :class="['p-2.5 rounded-lg border transition-all', border, hover]"
                :title="t.downloadTxtTitle"
              >
                <Download :size="18" />
              </button>
              <button
                @click="openRaw"
                :class="['p-2.5 rounded-lg border transition-all', border, hover]"
                :title="'Raw'"
              >
                <Code :size="18" />
              </button>
            </div>
          </div>

          <div :class="['rounded-xl p-6 border', input, border]">
            <pre class="whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[500px] overflow-auto" :class="text">{{ textContent }}</pre>
          </div>
        </div>

        <div :class="['rounded-2xl p-8 shadow-sm border relative overflow-hidden', card, border]">
          <div v-if="textInfo.hasPassword && !passwordVerified" class="absolute inset-0 backdrop-blur-md bg-black/10 z-10 flex items-center justify-center">
            <div class="text-center flex flex-col items-center">
              <Lock :size="48" :class="muted" />
              <p :class="['mt-4 font-semibold', text]">{{ t.enterPasswordToView }}</p>
            </div>
          </div>

          <h3 class="text-lg font-bold mb-6" :class="text">{{ t.detailedInformation }}</h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-if="textInfo.textStats" class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <Type :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.charactersLabel }}</p>
              <p :class="['text-sm font-bold', text]">{{ formatNumber(textInfo.textStats.charCount) }}</p>
            </div>

            <div v-if="textInfo.textStats" class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <AlignLeft :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.linesLabel }}</p>
              <p :class="['text-sm font-bold', text]">{{ formatNumber(textInfo.textStats.lineCount) }}</p>
            </div>

            <div class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <Clock :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.timeRemaining }}</p>
              <p :class="['text-sm font-bold', text]">{{ getTimeRemaining(textInfo.expiryDate, lang) }}</p>
            </div>

            <div v-if="textInfo.remainingDownloads !== undefined" class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <Eye :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.viewsRemaining }}</p>
              <p :class="['text-sm font-bold', text]">
                {{ textInfo.remainingDownloads === -1 ? t.unlimitedDownloads : textInfo.remainingDownloads }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="max-w-3xl mx-auto px-6">
        <div :class="['h-px w-full mb-6', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300']"></div>
        <div :class="['flex items-center justify-between text-sm pb-6', muted]">
          <span>© 2025 SecuresFileShare</span>
          <span>{{ t.secureFileSharing }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Globe, Moon, Sun, FileText, FileType, Type, AlignLeft, Clock, Eye, EyeOff, Lock, Copy, Check, Download, Link, Code } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'
import { useLocale } from '../composables/useLocale'
import { useFormatters } from '../composables/useFormatters'

const route = useRoute()

const { theme, bg, text, muted, border, hover, input, card, toggleTheme } = useTheme()
const { lang, t, toggleLang } = useLocale()
const { formatBytes, formatNumber, getTimeRemaining } = useFormatters()

const loading = ref(true)
const error = ref(null)
const textInfo = ref(null)
const textContent = ref('')
const password = ref('')
const showPassword = ref(false)
const passwordVerified = ref(false)
const fetching = ref(false)
const fetchError = ref(null)
const copied = ref(false)
const linkCopied = ref(false)

const fetchTextInfo = async () => {
  try {
    const textId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/info/${textId}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = t.value.textNotFound
      } else if (response.status === 410) {
        error.value = t.value.textExpired
      } else {
        error.value = t.value.errorLoadingInfo
      }
      return
    }

    textInfo.value = await response.json()

    if (!textInfo.value.hasPassword) {
      await fetchText()
    }
  } catch (err) {
    console.error('Error fetching text info:', err)
    error.value = t.value.errorLoadingText
  } finally {
    loading.value = false
  }
}

const fetchText = async () => {
  if (textInfo.value.hasPassword && !password.value && !passwordVerified.value) {
    fetchError.value = t.value.passwordRequired
    return
  }

  fetching.value = true
  fetchError.value = null

  try {
    const textId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    if (textInfo.value.hasPassword && !passwordVerified.value) {
      const verifyResponse = await fetch(`${apiUrl}/info/${textId}/verify`, {
        method: 'POST',
        headers: {
        'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password.value })
      })

      if (!verifyResponse.ok) {
        if (verifyResponse.status === 403) {
          fetchError.value = t.value.incorrectPassword
        } else if (verifyResponse.status === 404) {
          fetchError.value = t.value.textNotFound
        } else if (verifyResponse.status === 410) {
          fetchError.value = t.value.textExpired
        } else {
          fetchError.value = t.value.errorLoadingText
        }
        return
      }

      const fullMetadata = await verifyResponse.json()
      textInfo.value = { ...textInfo.value, ...fullMetadata }
      passwordVerified.value = true
    }

    const response = await fetch(`${apiUrl}/download/${textId}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: textInfo.value.hasPassword ? JSON.stringify({ password: password.value }) : '{}'
    })

    if (!response.ok) {
      if (response.status === 403) {
        fetchError.value = t.value.incorrectPassword
      } else if (response.status === 404) {
        fetchError.value = t.value.textNotFound
      } else if (response.status === 410) {
        fetchError.value = t.value.textExpired
      } else {
        fetchError.value = t.value.errorLoadingText
      }
      return
    }

    textContent.value = await response.text()
  } catch (err) {
    console.error('Error fetching text:', err)
    fetchError.value = t.value.errorLoadingText
  } finally {
    fetching.value = false
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error copying link:', err)
  }
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(textContent.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error copying text:', err)
  }
}

const downloadAsFile = () => {
  const blob = new Blob([textContent.value], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = textInfo.value.filename || 'text.txt'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

const openRaw = async () => {
  try {
    const textId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/raw/${textId}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: textInfo.value?.hasPassword ? JSON.stringify({ password: password.value }) : '{}'
    })

    if (!response.ok) {
      alert(t.value.errorLoadingText)
      return
    }

    const text = await response.text()
    const blob = new Blob([text], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')

    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (err) {
    console.error('Error opening raw text:', err)
    alert(t.value.errorLoadingText)
  }
}

fetchTextInfo()
</script>