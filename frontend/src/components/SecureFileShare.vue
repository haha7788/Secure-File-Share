<template>
  <div :class="['min-h-screen transition-colors duration-300', bg, text]">
    <header class="max-w-3xl mx-auto px-6 pt-6 pb-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">{{ t.title }}</h1>
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
      <template v-if="!uploadResult">
        <div class="text-center mb-10">
          <h2 class="text-4xl font-bold mb-3">{{ t.subtitle }}</h2>
          <p :class="['text-sm', muted]">E2E Encryption • No Registration • Open Source</p>
        </div>

        <div :class="['rounded-2xl p-8 mb-8 shadow-sm border', card, border]">
          <div
            :class="[
              'flex gap-2 p-1.5 rounded-xl border mb-6 relative',
              input,
              border
            ]"
          >
            <div
              class="absolute top-1.5 bottom-1.5 rounded-lg transition-all duration-300 ease-out pointer-events-none"
              :class="theme === 'dark' ? 'bg-white' : 'bg-gray-900'"
              :style="{
                width: 'calc((100% - 12px - 8px) / 2)',
                left: uploadType === 'file' ? '6px' : 'calc(50% + 4px)'
              }"
            />
            <button
              @click="uploadType = 'file'"
              :class="[
                'flex-1 py-3 rounded-lg transition-all duration-300 text-sm font-semibold relative z-10',
                uploadType === 'file'
                  ? (theme === 'dark' ? 'text-black' : 'text-white')
                  : (theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
              ]"
            >
              <Upload :size="16" class="inline mr-2" />
              {{ t.uploadFile }}
            </button>
            <button
              @click="uploadType = 'text'"
              :class="[
                'flex-1 py-3 rounded-lg transition-all duration-300 text-sm font-semibold relative z-10',
                uploadType === 'text'
                  ? (theme === 'dark' ? 'text-black' : 'text-white')
                  : (theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
              ]"
            >
              <FileText :size="16" class="inline mr-2" />
              {{ t.uploadText }}
            </button>
          </div>

          <div class="relative overflow-hidden h-[318px]">
            <div
              :class="[
                'transition-all duration-500 h-full',
                uploadType === 'file' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none'
              ]"
            >
              <div
                @dragenter="handleDrag"
                @dragleave="handleDrag"
                @dragover="handleDrag"
                @drop="handleDrop"
                @click="file ? null : $refs.fileInput.click()"
                :class="[
                  'h-[286px] rounded-xl border-2 border-dashed transition-all relative',
                  file ? '' : 'cursor-pointer',
                  dragActive
                    ? (theme === 'dark' ? 'border-white bg-[#2a2a2a]' : 'border-gray-900 bg-gray-100')
                    : `${border} ${hover}`
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileChange"
                  class="hidden"
                />
                <template v-if="file">
                  <button
                    @click.stop="removeFile"
                    :class="[
                      'absolute top-3 right-3 p-1.5 rounded transition-all z-10',
                      theme === 'dark'
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                    ]"
                    :title="t.removeFile"
                  >
                    <X :size="20" />
                  </button>
                </template>
                <div class="text-center px-4 flex items-center justify-center h-full">
                  <template v-if="file">
                    <div>
                    <div :class="['w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center', theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600']">
                      <Check :size="32" class="text-white" />
                    </div>
                    <p class="font-semibold text-lg mb-1">{{ file.name }}</p>
                    <p :class="['text-sm', muted]">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                    <Upload :size="56" :class="['mx-auto mb-4', muted]" />
                    <p class="font-medium mb-1">{{ t.dropFile }}</p>
                    <p :class="['text-sm', muted]">{{ t.orClick }}</p>
                    </div>
                  </template>
                </div>
              </div>
              <p :class="['text-xs mt-2 text-center h-[20px] leading-5', muted]">{{ t.maxFileSize }}</p>
            </div>

            <div
              :class="[
                'transition-all duration-500 h-full',
                uploadType === 'text' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
              ]"
            >
              <div class="space-y-3 h-[286px] flex flex-col">
                <input
                  v-model="textTitle"
                  type="text"
                  maxlength="96"
                  :placeholder="t.titlePlaceholder"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border transition-all text-sm',
                    theme === 'dark'
                      ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-white'
                      : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-gray-900'
                  ]"
                  style="outline: none; box-shadow: none;"
                />
                <textarea
                  v-model="textContent"
                  :placeholder="t.textPlaceholder"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border transition-all resize-none text-sm flex-1',
                    theme === 'dark'
                      ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-white'
                      : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-gray-900'
                  ]"
                  style="outline: none; box-shadow: none;"
                />
              </div>
              <p :class="['text-xs mt-2 text-center h-[20px] leading-5', muted]">{{ t.maxTextSize }}</p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="showSettings = true"
              :class="['flex-1 py-3.5 rounded-xl border transition-all text-sm font-semibold', border, hover]"
            >
              {{ t.settings }}
            </button>
            <button
              @click="handleUpload"
              :disabled="uploading || (uploadType === 'file' && !file) || (uploadType === 'text' && !textContent)"
              :class="[
                'flex-1 py-3.5 rounded-xl font-semibold transition-all text-sm shadow-sm',
                theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              ]"
            >
              <template v-if="uploading">
                <span class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  {{ t.uploading }}
                </span>
              </template>
              <template v-else>
                {{ t.upload }}
              </template>
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="text-center mb-10">
          <h2 class="text-4xl font-bold mb-3">{{ t.subtitle }}</h2>
          <p :class="['text-sm', muted]">E2E Encryption • No Registration • Open Source</p>
        </div>

        <div :class="['rounded-2xl p-8 shadow-sm border', card, border]">
          <div class="text-center py-6 mb-6">
            <div :class="['w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center', theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600']">
              <Check :size="40" class="text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-2">{{ t.yourLink }}</h3>
            <p :class="['text-sm', muted]">
              {{ uploadType === 'text' ? t.textUploadedSuccess : t.fileUploadedSuccess }}
            </p>
          </div>

          <div :class="['flex gap-2 p-3 rounded-xl border mb-6', input, border]">
            <input
              type="text"
              :value="uploadResult.url"
              readonly
              class="flex-1 px-2 bg-transparent focus:outline-none text-sm font-mono"
            />
            <button
              @click="copyToClipboard(uploadResult.url)"
              :class="[
                'px-5 py-2.5 rounded-lg transition-all text-sm font-semibold flex items-center gap-2',
                copied
                  ? (theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white')
                  : (theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800')
              ]"
            >
              <Check v-if="copied" :size="16" />
              <Copy v-else :size="16" />
              {{ copied ? t.copied : t.copyLink }}
            </button>
          </div>

          <button
            @click="resetUpload"
            :class="['w-full py-3.5 rounded-xl border transition-all text-sm font-semibold', border, hover]"
          >
            {{ t.newUpload }}
          </button>
        </div>
      </template>

      <div class="mt-16 mb-16">
        <h3 class="text-2xl font-bold mb-8">{{ t.why }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(feature, idx) in features"
            :key="idx"
            :class="['rounded-xl p-5 transition-all text-center border', card, border, hover]"
          >
            <div :class="['w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center', theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white']">
              <component :is="feature.icon" :size="24" />
            </div>
            <h4 class="font-semibold text-sm mb-1">{{ feature.title }}</h4>
            <p :class="['text-xs', muted]">{{ feature.desc }}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-2xl font-bold mb-8">{{ t.apiTitle }}</h3>

        <div
          :class="[
            'flex gap-2 p-1.5 rounded-xl border mb-6 relative max-w-md mx-auto',
            input,
            border
          ]"
        >
          <div
            class="absolute top-1.5 bottom-1.5 rounded-lg transition-all duration-300 ease-out pointer-events-none"
            :class="theme === 'dark' ? 'bg-white' : 'bg-gray-900'"
            :style="{
              width: 'calc((100% - 12px - 8px) / 2)',
              left: apiType === 'file' ? '6px' : 'calc(50% + 4px)'
            }"
          />
          <button
            @click="apiType = 'file'"
            :class="[
              'flex-1 py-3 rounded-lg transition-all duration-300 text-sm font-semibold relative z-10',
              apiType === 'file'
                ? (theme === 'dark' ? 'text-black' : 'text-white')
                : (theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
            ]"
          >
            <Upload :size="16" class="inline mr-2" />
            {{ t.uploadFile }}
          </button>
          <button
            @click="apiType = 'text'"
            :class="[
              'flex-1 py-3 rounded-lg transition-all duration-300 text-sm font-semibold relative z-10',
              apiType === 'text'
                ? (theme === 'dark' ? 'text-black' : 'text-white')
                : (theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
            ]"
          >
            <FileText :size="16" class="inline mr-2" />
            {{ t.uploadText }}
          </button>
        </div>

        <div class="flex flex-col gap-6">
          <div
            v-for="(item, idx) in apiDocs"
            :key="idx"
            :class="['rounded-xl p-6 border', card, border]"
          >
            <h4 class="font-bold text-base mb-1">{{ item.title }}</h4>
            <p :class="['text-xs mb-4', muted]">{{ item.desc }}</p>

            <div class="flex gap-2 mb-3 flex-wrap">
              <template v-if="item.isResponse">
                <button
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold',
                    theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white'
                  ]"
                >
                  JSON
                </button>
              </template>
              <template v-else>
                <button
                  v-for="langKey in ['curl', 'nodejs', 'python', 'go']"
                  :key="langKey"
                  @click="selectedLang[idx] = langKey"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    (selectedLang[idx] || 'curl') === langKey
                      ? (theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white')
                      : (theme === 'dark' ? 'bg-[#222222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black')
                  ]"
                >
                  {{ langKey === 'nodejs' ? 'Node.js' : langKey === 'curl' ? 'cURL' : langKey === 'python' ? 'Python' : 'Go' }}
                </button>
              </template>
            </div>

            <div class="relative group">
              <div :class="['rounded-lg p-4 border transition-colors', theme === 'dark' ? 'bg-black group-hover:bg-[#0a0a0a]' : 'bg-gray-200 group-hover:bg-gray-300', border]">
                <pre :class="['text-xs overflow-x-auto font-mono leading-relaxed', muted]">{{ item.isResponse ? item.code : item.examples[selectedLang[idx] || 'curl'] }}</pre>
              </div>
              <button
                @click="copyCode(item.isResponse ? item.code : item.examples[selectedLang[idx] || 'curl'], idx)"
                :class="[
                  'absolute top-2 right-2 p-2 rounded-lg transition-all',
                  copiedCode[idx]
                    ? (theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white')
                    : (theme === 'dark' ? 'bg-[#151515] hover:bg-[#222222]' : 'bg-white hover:bg-gray-200'),
                  'border',
                  border
                ]"
                :title="copiedCode[idx] ? t.codeCopied : t.copyCode"
              >
                <Check v-if="copiedCode[idx]" :size="16" />
                <Copy v-else :size="16" />
              </button>
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

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <Transition name="scale">
            <div v-if="showSettings" :class="['w-full max-w-md rounded-2xl shadow-2xl border', theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200']">
              <div :class="['p-6 border-b', theme === 'dark' ? 'border-gray-700' : 'border-gray-200']">
                <div class="flex items-center justify-between">
                  <h3 :class="['text-xl font-bold', theme === 'dark' ? 'text-white' : 'text-black']">{{ t.settings }}</h3>
                  <button
                    @click="showSettings = false"
                    :class="['w-9 h-9 rounded-lg flex items-center justify-center transition-all', theme === 'dark' ? 'text-white hover:bg-[#222222]' : 'text-black hover:bg-gray-200']"
                  >
                    <X :size="20" />
                  </button>
                </div>
              </div>
              <div class="p-6 space-y-5">
                <div>
                  <label :class="['block text-sm font-semibold mb-2.5 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-black']">
                    <Clock :size="16" />
                    {{ t.expiry }}
                  </label>
                  <div class="relative">
                    <select
                      v-model="expiry"
                      :class="[
                        'w-full px-4 py-3 pr-10 rounded-xl border transition-all text-sm cursor-pointer appearance-none',
                        theme === 'dark'
                          ? 'bg-[#1a1a1a] border-gray-700 text-white focus:border-white hover:border-gray-600'
                          : 'bg-gray-50 border-gray-200 text-black focus:border-gray-900 hover:border-gray-300'
                      ]"
                      style="outline: none; box-shadow: none;"
                    >
                      <option v-for="(day, idx) in t.days" :key="idx" :value="[1, 3, 7, 14, 30][idx]">
                        {{ day }}
                      </option>
                    </select>
                    <ChevronDown :size="18" :class="['absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors', muted]" />
                  </div>
                </div>

                <div>
                  <label :class="['block text-sm font-semibold mb-2.5 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-black']">
                    <Trash2 :size="16" />
                    {{ t.deleteAfter }}
                  </label>
                  <div class="relative">
                    <select
                      v-model="deleteAfter"
                      :class="[
                        'w-full px-4 py-3 pr-10 rounded-xl border transition-all text-sm cursor-pointer appearance-none',
                        theme === 'dark'
                          ? 'bg-[#1a1a1a] border-gray-700 text-white focus:border-white hover:border-gray-600'
                          : 'bg-gray-50 border-gray-200 text-black focus:border-gray-900 hover:border-gray-300'
                      ]"
                      style="outline: none; box-shadow: none;"
                    >
                      <option v-for="(label, idx) in t.downloads" :key="idx" :value="[0, 1, 3, 5, 10, 25, 50, 100][idx]">
                        {{ label === 'Не удалять' || label === 'Never' ? label : `${label} ${t.downloadText}` }}
                      </option>
                    </select>
                    <ChevronDown :size="18" :class="['absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors', muted]" />
                  </div>
                </div>

                <div>
                  <label :class="['block text-sm font-semibold mb-2.5 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-black']">
                    <Lock :size="16" />
                    {{ t.password }}
                  </label>
                  <div class="relative">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :class="[
                        'w-full px-4 py-3 pr-12 rounded-xl border transition-all text-sm',
                        theme === 'dark'
                          ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-white'
                          : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-gray-900'
                      ]"
                      style="outline: none; box-shadow: none;"
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
                </div>

                <button
                  @click="showSettings = false"
                  :class="['w-full py-3.5 rounded-xl font-semibold transition-all text-sm shadow-sm', theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800']"
                >
                  {{ t.apply }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Upload, FileText, Globe, Moon, Sun, Copy, Check,
  X, Clock, Lock, Trash2, Shield, Zap, Code, Eye, EyeOff, ChevronDown
} from 'lucide-vue-next'
import { apiFetch } from '../composables/useApi.js'
import ru from '../locales/ru.js'
import en from '../locales/en.js'
import './SecureFileShare.css'

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.__THEME__) {
    return window.__THEME__;
  }
  const stored = localStorage.getItem('securefileshare_theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialLang = () => {
  if (typeof window !== 'undefined' && window.__LANG__) {
    return window.__LANG__;
  }
  return localStorage.getItem('securefileshare_lang') || 'ru';
};

const theme = ref(getInitialTheme())
const lang = ref(getInitialLang())
const uploadType = ref('file')
const file = ref(null)
const fileInput = ref(null)
const textTitle = ref('')
const textContent = ref('')
const showSettings = ref(false)
const expiry = ref('1')
const password = ref('')
const showPassword = ref(false)
const deleteAfter = ref('0')
const uploadResult = ref(null)
const copied = ref(false)
const uploading = ref(false)
const dragActive = ref(false)
const copiedCode = ref({})
const selectedLang = ref({})
const apiType = ref('file')

const translations = { ru, en }

const t = computed(() => translations[lang.value])

const bg = computed(() => theme.value === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white')
const text = computed(() => theme.value === 'dark' ? 'text-white' : 'text-black')
const muted = computed(() => theme.value === 'dark' ? 'text-gray-400' : 'text-gray-600')
const border = computed(() => theme.value === 'dark' ? 'border-gray-700' : 'border-gray-200')
const hover = computed(() => theme.value === 'dark' ? 'hover:bg-[#222222]' : 'hover:bg-gray-200')
const input = computed(() => theme.value === 'dark' ? 'bg-[#151515] border-gray-700' : 'bg-gray-50 border-gray-200')
const card = computed(() => theme.value === 'dark' ? 'bg-[#151515]' : 'bg-gray-50')

const features = computed(() => [
  { title: t.value.feature1, desc: t.value.feature1desc, icon: Shield },
  { title: t.value.feature2, desc: t.value.feature2desc, icon: Zap },
  { title: t.value.feature3, desc: t.value.feature3desc, icon: Clock },
  { title: t.value.feature4, desc: t.value.feature4desc, icon: Code }
])

const fileApiDocs = computed(() => [
  {
    title: t.value.fileStep1,
    desc: t.value.fileStep1desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/upload \\\n  -F "file=@document.pdf"`,
      nodejs: `const FormData = require('form-data');\nconst fs = require('fs');\n\nconst form = new FormData();\nform.append('file', fs.createReadStream('document.pdf'));\n\nfetch('https://api.securefileshare.su/upload', {\n  method: 'POST',\n  body: form\n}).then(res => res.json())\n  .then(data => console.log(data));`,
      python: `import requests\n\nwith open('document.pdf', 'rb') as f:\n    files = {'file': f}\n    response = requests.post(\n        'https://api.securefileshare.su/upload',\n        files=files\n    )\n    print(response.json())`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"io"\n\t"mime/multipart"\n\t"net/http"\n\t"os"\n)\n\nfunc main() {\n\tbody := &bytes.Buffer{}\n\twriter := multipart.NewWriter(body)\n\tfile, _ := os.Open("document.pdf")\n\tpart, _ := writer.CreateFormFile("file", "document.pdf")\n\tio.Copy(part, file)\n\twriter.Close()\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/upload", body)\n\treq.Header.Set("Content-Type", writer.FormDataContentType())\n\tclient := &http.Client{}\n\tclient.Do(req)\n}`
    }
  },
  {
    title: t.value.fileStep2,
    desc: t.value.fileStep2desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/upload \\\n  -F "file=@photo.jpg" \\\n  -F "expiry=7" \\\n  -F "password=secret" \\\n  -F "deleteAfter=5"`,
      nodejs: `const FormData = require('form-data');\nconst fs = require('fs');\n\nconst form = new FormData();\nform.append('file', fs.createReadStream('photo.jpg'));\nform.append('expiry', '7');\nform.append('password', 'secret');\nform.append('deleteAfter', '5');\n\nfetch('https://api.securefileshare.su/upload', {\n  method: 'POST',\n  body: form\n}).then(res => res.json())\n  .then(data => console.log(data));`,
      python: `import requests\n\nwith open('photo.jpg', 'rb') as f:\n    files = {'file': f}\n    data = {\n        'expiry': '7',\n        'password': 'secret',\n        'deleteAfter': '5'\n    }\n    response = requests.post(\n        'https://api.securefileshare.su/upload',\n        files=files,\n        data=data\n    )\n    print(response.json())`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"io"\n\t"mime/multipart"\n\t"net/http"\n\t"os"\n)\n\nfunc main() {\n\tbody := &bytes.Buffer{}\n\twriter := multipart.NewWriter(body)\n\tfile, _ := os.Open("photo.jpg")\n\tpart, _ := writer.CreateFormFile("file", "photo.jpg")\n\tio.Copy(part, file)\n\twriter.WriteField("expiry", "7")\n\twriter.WriteField("password", "secret")\n\twriter.WriteField("deleteAfter", "5")\n\twriter.Close()\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/upload", body)\n\treq.Header.Set("Content-Type", writer.FormDataContentType())\n\tclient := &http.Client{}\n\tclient.Do(req)\n}`
    }
  },
  {
    title: t.value.fileStep3,
    desc: t.value.fileStep3desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/download/abc123 \\\n  -H "Content-Type: application/json" \\\n  -d '{"password": "secret"}' \\\n  --output file.jpg`,
      nodejs: `fetch('https://api.securefileshare.su/download/abc123', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ password: 'secret' })\n}).then(res => res.blob())\n  .then(blob => {\n    // Save file\n  });`,
      python: `import requests\n\nresponse = requests.post(\n    'https://api.securefileshare.su/download/abc123',\n    json={'password': 'secret'}\n)\n\nwith open('file.jpg', 'wb') as f:\n    f.write(response.content)`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"io"\n\t"net/http"\n\t"os"\n)\n\nfunc main() {\n\tdata := map[string]string{"password": "secret"}\n\tjsonData, _ := json.Marshal(data)\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/download/abc123", bytes.NewBuffer(jsonData))\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tdefer resp.Body.Close()\n\n\tout, _ := os.Create("file.jpg")\n\tdefer out.Close()\n\tio.Copy(out, resp.Body)\n}`
    }
  },
  {
    title: t.value.fileStep4,
    desc: t.value.fileStep4desc,
    isResponse: true,
    code: `{\n  "success": true,\n  "id": "abc123",\n  "url": "https://securesfileshare.su/file/abc123",\n  "expiryDate": "2025-12-23T12:00:00Z"\n}`
  }
])

const textApiDocs = computed(() => [
  {
    title: t.value.textStep1,
    desc: t.value.textStep1desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/upload/text \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "My Note", "content": "Hello World"}'`,
      nodejs: `fetch('https://api.securefileshare.su/upload/text', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    title: 'My Note',\n    content: 'Hello World'\n  })\n}).then(res => res.json())\n  .then(data => console.log(data));`,
      python: `import requests\n\ndata = {\n    'title': 'My Note',\n    'content': 'Hello World'\n}\n\nresponse = requests.post(\n    'https://api.securefileshare.su/upload/text',\n    json=data\n)\nprint(response.json())`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"net/http"\n)\n\nfunc main() {\n\tdata := map[string]string{\n\t\t"title": "My Note",\n\t\t"content": "Hello World",\n\t}\n\tjsonData, _ := json.Marshal(data)\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/upload/text", bytes.NewBuffer(jsonData))\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tclient.Do(req)\n}`
    }
  },
  {
    title: t.value.textStep2,
    desc: t.value.textStep2desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/upload/text \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "Secret Note", "content": "Confidential", "expiry": 7, "password": "secret", "deleteAfter": 5}'`,
      nodejs: `fetch('https://api.securefileshare.su/upload/text', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    title: 'Secret Note',\n    content: 'Confidential',\n    expiry: 7,\n    password: 'secret',\n    deleteAfter: 5\n  })\n}).then(res => res.json())\n  .then(data => console.log(data));`,
      python: `import requests\n\ndata = {\n    'title': 'Secret Note',\n    'content': 'Confidential',\n    'expiry': 7,\n    'password': 'secret',\n    'deleteAfter': 5\n}\n\nresponse = requests.post(\n    'https://api.securefileshare.su/upload/text',\n    json=data\n)\nprint(response.json())`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"net/http"\n)\n\nfunc main() {\n\tdata := map[string]interface{}{\n\t\t"title": "Secret Note",\n\t\t"content": "Confidential",\n\t\t"expiry": 7,\n\t\t"password": "secret",\n\t\t"deleteAfter": 5,\n\t}\n\tjsonData, _ := json.Marshal(data)\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/upload/text", bytes.NewBuffer(jsonData))\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tclient.Do(req)\n}`
    }
  },
  {
    title: t.value.textStep3,
    desc: t.value.textStep3desc,
    examples: {
      curl: `curl -X POST \\\n  https://api.securefileshare.su/download/abc123 \\\n  -H "Content-Type: application/json" \\\n  -d '{"password": "secret"}'`,
      nodejs: `fetch('https://api.securefileshare.su/download/abc123', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ password: 'secret' })\n}).then(res => res.text())\n  .then(text => console.log(text));`,
      python: `import requests\n\nresponse = requests.post(\n    'https://api.securefileshare.su/download/abc123',\n    json={'password': 'secret'}\n)\nprint(response.text)`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tdata := map[string]string{"password": "secret"}\n\tjsonData, _ := json.Marshal(data)\n\n\treq, _ := http.NewRequest("POST", "https://api.securefileshare.su/download/abc123", bytes.NewBuffer(jsonData))\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tprintln(string(body))\n}`
    }
  },
  {
    title: t.value.textStep4,
    desc: t.value.textStep4desc,
    isResponse: true,
    code: `{\n  "success": true,\n  "id": "abc123",\n  "url": "https://securesfileshare.su/text/abc123",\n  "expiryDate": "2025-12-23T12:00:00Z"\n}`
  }
])

const apiDocs = computed(() => apiType.value === 'file' ? fileApiDocs.value : textApiDocs.value)

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('securesfileshare_theme', theme.value)
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleLang = () => {
  lang.value = lang.value === 'ru' ? 'en' : 'ru'
  localStorage.setItem('securesfileshare_lang', lang.value)
  document.documentElement.lang = lang.value
}

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0]
  if (selectedFile && selectedFile.size > 1024 * 1024 * 1024) {
    alert(t.value.fileTooLarge)
    return
  }
  file.value = selectedFile
}

const handleDrag = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === "dragenter" || e.type === "dragover") {
    dragActive.value = true
  } else if (e.type === "dragleave") {
    dragActive.value = false
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = false
  if (e.dataTransfer.files?.[0]) {
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile.size > 1024 * 1024 * 1024) {
      alert(t.value.fileTooLarge)
      return
    }
    file.value = droppedFile
  }
}

const handleUpload = async () => {
  if (uploadType.value === 'file' && !file.value) return
  if (uploadType.value === 'text' && !textContent.value) return

  uploading.value = true

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const endpoint = uploadType.value === 'file'
      ? `${apiUrl}/upload`
      : `${apiUrl}/upload/text`
    let requestOptions = { method: 'POST' }

    if (uploadType.value === 'file') {
      const formData = new FormData()
      formData.append('file', file.value)
      formData.append('expiry', expiry.value)
      if (password.value) {
        formData.append('password', password.value)
      }
      formData.append('deleteAfter', deleteAfter.value)
      requestOptions.body = formData
    } else {
      const jsonData = {
        title: textTitle.value,
        content: textContent.value,
        expiry: expiry.value,
        deleteAfter: deleteAfter.value
      }
      if (password.value) {
        jsonData.password = password.value
      }
      requestOptions.headers = { 'Content-Type': 'application/json' }
      requestOptions.body = JSON.stringify(jsonData)
    }

    const response = await apiFetch(endpoint, requestOptions)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()
    uploadResult.value = {
      id: result.id,
      url: result.url
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert(lang.value === 'ru'
      ? `Ошибка загрузки: ${error.message}`
      : `Upload error: ${error.message}`)
  } finally {
    uploading.value = false
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const resetUpload = () => {
  uploadResult.value = null
  file.value = null
  textContent.value = ''
  textTitle.value = ''
  password.value = ''
}

const removeFile = () => {
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const copyCode = (code, idx) => {
  navigator.clipboard.writeText(code)
  copiedCode.value[idx] = true
  setTimeout(() => {
    copiedCode.value[idx] = false
  }, 2000)
}

onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  document.documentElement.lang = lang.value
})
</script>