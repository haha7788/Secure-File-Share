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
            <File :size="40" />
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

      <div v-else-if="fileInfo">
        <div :class="['rounded-2xl p-8 mb-6 shadow-sm border', card, border]">
          <div class="text-center mb-6">
            <div :class="['w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
              <File :size="40" />
            </div>
            <h2 class="text-2xl font-bold mb-2 break-words px-4" :class="text">{{ fileInfo.filename }}</h2>
            <p :class="['text-sm', muted]">{{ formatBytes(fileInfo.size)}} • {{ t.expiresIn }} {{ getTimeRemaining(fileInfo.expiryDate, lang) }}</p>
            <p v-if="fileInfo.hasPassword" class="text-yellow-500 text-sm mt-2 flex items-center justify-center gap-2">
              <Lock :size="16" />
              {{ t.passwordProtected }}
            </p>
          </div>

          <div v-if="fileInfo.hasPassword && !passwordVerified" class="mb-6">
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
                @keyup.enter="verifyPassword"
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
            <p v-if="downloadError" class="text-red-500 text-xs mt-2">{{ downloadError }}</p>
          </div>

          <button
            v-if="fileInfo.hasPassword && !passwordVerified"
            @click="verifyPassword"
            :disabled="verifying || !password"
            :class="[
              'w-full px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-sm mb-6',
              theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            ]"
          >
            {{ verifying ? t.verifying : t.confirm }}
          </button>

          <div v-if="!fileInfo.hasPassword || passwordVerified" class="flex flex-col gap-3">
            <button
              @click="downloadFile"
              :disabled="downloading || (fileInfo.hasPassword && !passwordVerified && !password)"
              :class="[
                'w-full px-6 py-3.5 rounded-xl font-semibold transition-all text-sm shadow-sm flex items-center justify-center gap-2',
                theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              ]"
            >
              <Download :size="20" />
              {{ downloading ? t.downloading : t.downloadFileBtn }}
            </button>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="copyLink"
                :class="[
                  'px-4 py-3 rounded-xl transition-all text-sm font-semibold flex items-center justify-center gap-2',
                  linkCopied
                    ? (theme === 'dark' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700')
                    : `border ${border} ${hover}`
                ]"
              >
                <Check v-if="linkCopied" :size="18" />
                <Link v-else :size="18" />
                {{ linkCopied ? t.linkCopied : t.linkBtn }}
              </button>
              <button
                @click="downloadAsZip"
                :disabled="downloading || (fileInfo.hasPassword && !passwordVerified && !password)"
                :class="[
                  'px-4 py-3 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center gap-2',
                  border, hover,
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                ]"
              >
                <Archive :size="18" />
                ZIP
              </button>
            </div>
          </div>
        </div>

        <div :class="['rounded-2xl p-8 shadow-sm border relative overflow-hidden', card, border]">
          <div v-if="fileInfo.hasPassword && !passwordVerified" class="absolute inset-0 backdrop-blur-md bg-black/10 z-10 flex items-center justify-center">
            <div class="text-center flex flex-col items-center">
              <Lock :size="48" :class="muted" />
              <p :class="['mt-4 font-semibold', text]">{{ t.enterPasswordToView }}</p>
            </div>
          </div>

          <h3 class="text-lg font-bold mb-6" :class="text">{{ t.detailedInformation }}</h3>

          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <HardDrive :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.fileSizeLabel }}</p>
              <p :class="['text-sm font-bold', text]">{{ formatBytes(fileInfo.size) }}</p>
            </div>

            <div class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <Clock :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.timeRemaining }}</p>
              <p :class="['text-sm font-bold', text]">{{ getTimeRemaining(fileInfo.expiryDate, lang) }}</p>
            </div>

            <div v-if="fileInfo.remainingDownloads !== undefined" class="text-center">
              <div :class="['w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
                <Download :size="20" />
              </div>
              <p :class="['text-xs font-semibold mb-1', muted]">{{ t.remainingDownloads }}</p>
              <p :class="['text-sm font-bold', text]">
                {{ fileInfo.remainingDownloads === -1 ? t.unlimitedDownloads : fileInfo.remainingDownloads }}
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
          <span>© 2025 SecureFileShare</span>
          <span>{{ t.secureFileSharing }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Globe, Moon, Sun, FileText, HardDrive, File, Clock, Download, Lock, Eye, EyeOff, Link, Archive } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'
import { useLocale } from '../composables/useLocale'
import { useFormatters } from '../composables/useFormatters'

const route = useRoute()

const { theme, bg, text, muted, border, hover, card, toggleTheme } = useTheme()
const { lang, t, toggleLang } = useLocale()
const { formatBytes, getTimeRemaining } = useFormatters()

const loading = ref(true)
const error = ref(null)
const fileInfo = ref(null)
const password = ref('')
const showPassword = ref(false)
const passwordVerified = ref(false)
const verifying = ref(false)
const downloading = ref(false)
const downloadError = ref(null)
const linkCopied = ref(false)

const fetchFileInfo = async () => {
  try {
    const fileId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/info/${fileId}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = t.value.fileNotFound
      } else if (response.status === 410) {
        error.value = t.value.fileExpired
      } else {
        error.value = t.value.errorLoadingInfo
      }
      return
    }

    fileInfo.value = await response.json()
  } catch (err) {
    console.error('Error fetching file info:', err)
    error.value = t.value.errorLoadingInfo
  } finally {
    loading.value = false
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

const verifyPassword = async () => {
  if (!password.value) {
    downloadError.value = t.value.passwordRequired
    return
  }

  verifying.value = true
  downloadError.value = null

  try {
    const fileId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/info/${fileId}/verify`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })

    if (!response.ok) {
      if (response.status === 403) {
        downloadError.value = t.value.incorrectPassword
      } else if (response.status === 404) {
        downloadError.value = t.value.fileNotFound
      } else if (response.status === 410) {
        downloadError.value = t.value.fileExpired
      } else {
        downloadError.value = t.value.errorDownloading
      }
      return
    }

    const fullMetadata = await response.json()
    fileInfo.value = { ...fileInfo.value, ...fullMetadata }
    passwordVerified.value = true
    downloadError.value = null
  } catch (err) {
    console.error('Error verifying password:', err)
    downloadError.value = t.value.errorDownloading
  } finally {
    verifying.value = false
  }
}

const downloadFile = async () => {
  if (fileInfo.value.hasPassword && !password.value && !passwordVerified.value) {
    downloadError.value = t.value.passwordRequired
    return
  }

  downloading.value = true
  downloadError.value = null

  try {
    const fileId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/download/${fileId}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: fileInfo.value.hasPassword ? JSON.stringify({ password: password.value }) : '{}'
    })

    if (!response.ok) {
      if (response.status === 403) {
        downloadError.value = t.value.incorrectPassword
      } else if (response.status === 404) {
        downloadError.value = t.value.fileNotFound
      } else if (response.status === 410) {
        downloadError.value = t.value.fileExpired
      } else {
        downloadError.value = t.value.errorDownloading
      }
      return
    }

    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = fileInfo.value.filename || 'file'

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/i)
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1])
      }
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    passwordVerified.value = true
  } catch (err) {
    console.error('Error downloading file:', err)
    downloadError.value = t.value.errorDownloading
  } finally {
    downloading.value = false
  }
}

const downloadAsZip = async () => {
  if (fileInfo.value.hasPassword && !password.value && !passwordVerified.value) {
    downloadError.value = t.value.passwordRequired
    return
  }

  downloading.value = true
  downloadError.value = null

  try {
    const fileId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiUrl}/download/${fileId}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: fileInfo.value.hasPassword ? JSON.stringify({ password: password.value }) : '{}'
    })

    if (!response.ok) {
      if (response.status === 403) {
        downloadError.value = t.value.incorrectPassword
      } else if (response.status === 404) {
        downloadError.value = t.value.fileNotFound
      } else if (response.status === 410) {
        downloadError.value = t.value.fileExpired
      } else {
        downloadError.value = t.value.errorDownloading
      }
      return
    }

    const blob = await response.blob()

    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    zip.file(fileInfo.value.filename, blob)

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = window.URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileInfo.value.filename.replace(/\.[^/.]+$/, '') + '.zip'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    passwordVerified.value = true
  } catch (err) {
    console.error('Error downloading file as zip:', err)
    downloadError.value = t.value.errorDownloading
  } finally {
    downloading.value = false
  }
}

fetchFileInfo()
</script>