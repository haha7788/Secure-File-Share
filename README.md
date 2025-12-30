<div align="center">

# 🔐 SecureFileShare

### Защищенный сервис обмена файлами нового поколения
### Secure File Sharing Service of the New Generation

**Анонимно • Безопасно • Удобно**
**Anonymous • Secure • Convenient**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue.svg)](https://telegram.org/)

**Language / Язык:** [🇬🇧 English](#-english) | [🇷🇺 Русский](#-русский)

</div>

---

# 🇬🇧 English

## 🎯 About

**SecureFileShare** is a modern file sharing service with **E2E encryption** and **Telegram integration**. Send files via web interface or Telegram bot — **links work everywhere!**

### ✨ Key Features

<table>
<tr>
<td width="50%">

#### 🌐 Web Interface
- 🎨 Modern UI with dark/light themes
- 📱 Fully responsive design
- 🌍 Multi-language (RU/EN)
- ⚡ Lightning-fast Vue 3

</td>
<td width="50%">

#### 🤖 Telegram Bot
- 💬 Full functionality in messenger
- 🔗 **Unified links** with web version
- 📲 Easy button navigation
- 🌐 Bilingual support

</td>
</tr>
</table>

### 🔒 Security First

- ✅ **AES-256** password encryption
- ✅ **CSRF, XSS, Path Traversal** protection
- ✅ **Rate Limiting** against DDoS
- ✅ File validation via MIME + magic numbers
- ✅ Complete **anonymity** — no registration

### ⚡ Unique Features

| Feature | Description |
|---------|-------------|
| 🔗 **Unified Links** | Upload via bot → download on web, and vice versa |
| ⏰ **Auto-deletion** | By time (1-30 days) or downloads (1-100) |
| 🔐 **Password Protection** | Optional file encryption |
| 📄 **Text Notes** | Share text with syntax highlighting |
| 🎯 **No Registration** | Completely anonymous |

---

## 📸 Screenshots

<div align="center">

### Web Interface

<img src=".github/assets/web-upload.png" width="45%" alt="File Upload">
<img src=".github/assets/web-download.png" width="45%" alt="File Download">

### Telegram Bot

<img src=".github/assets/bot-menu.png" width="45%" alt="Bot Menu">
<img src=".github/assets/bot-upload.png" width="45%" alt="Upload via Bot">

</div>

---

## 🚀 Quick Start

### Requirements

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Telegram Bot Token** (get from [@BotFather](https://t.me/BotFather))

### ⚡ Installation in 3 Steps

```bash
# 1. Clone repository
git clone https://github.com/haha7788/secure-file-share.git
cd secure-file-share

# 2. Install all dependencies
npm run install:all

# 3. Configure environment
cp server/.env.example server/.env
cp telegram-bot/.env.example telegram-bot/.env
cp frontend/.env.example frontend/.env

# Add your BOT_TOKEN to telegram-bot/.env
```

### 🎬 Launch

Open **3 terminals**:

```bash
# Terminal 1: Backend
npm run dev:server
# ➜ http://localhost:3000

# Terminal 2: Frontend
npm run dev:frontend
# ➜ http://localhost:5173

# Terminal 3: Telegram Bot
npm run dev:bot
# ➜ Bot running...
```

**Done! 🎉** Open `http://localhost:5173`

---

## 📁 Project Structure

```
secure-file-share/
│
├── 🌐 frontend/          # Vue 3 + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── composables/  # Reusable logic
│   │   └── locales/      # Translations
│   └── .env.example
│
├── 🔧 server/            # Express.js API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, CORS, etc
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Security
│   │   └── utils/        # Helpers
│   ├── uploads/          # User files
│   └── data/             # Metadata
│
└── 🤖 telegram-bot/      # Telegraf bot
    ├── src/
    │   ├── handlers/     # Commands
    │   ├── keyboards/    # Inline buttons
    │   ├── locales/      # Translations
    │   └── services/     # API client
    └── temp/             # Temp files
```

---

## 🔌 API Documentation

### Upload File

```bash
POST /upload

curl -X POST http://localhost:3000/upload \
  -F "file=@document.pdf" \
  -F "expiry=7" \
  -F "password=secret123" \
  -F "deleteAfter=5"

# Response
{
  "success": true,
  "id": "abc123xyz",
  "url": "http://localhost:5173/file/abc123xyz",
  "expiryDate": "2025-01-06T12:00:00.000Z"
}
```

### Upload Text

```bash
POST /upload/text

curl -X POST http://localhost:3000/upload/text \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "Secret text",
    "expiry": 7,
    "password": "secret123"
  }'
```

### Download File

```bash
GET /download/:id?password=secret123

curl http://localhost:3000/download/abc123xyz?password=secret123 \
  -o file.pdf
```

---

## 🤖 Telegram Bot

### Commands

| Command | Description |
|---------|-------------|
| `/start` | Main menu |
| `/help` | Usage guide |
| `/upload` | Upload file/text |
| `/download` | Download by link |

### Getting Token

1. Message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow instructions
4. Copy token to `telegram-bot/.env`

```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

---

## ⚙️ Configuration

<details>
<summary><b>server/.env</b></summary>

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=1073741824    # 1 GB
MAX_TEXT_SIZE=2097152        # 2 MB
```
</details>

<details>
<summary><b>telegram-bot/.env</b></summary>

```env
BOT_TOKEN=your_bot_token_here
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```
</details>

<details>
<summary><b>frontend/.env</b></summary>

```env
VITE_API_URL=http://localhost:3000
```
</details>

---

## 🛡️ Security

| Protection | Implementation |
|------------|----------------|
| **CSRF** | Token + Origin check |
| **XSS** | CSP + Sanitization |
| **Path Traversal** | Filename validation |
| **Brute Force** | Rate limiting |
| **Passwords** | bcrypt (10 rounds) |
| **File Upload** | Extension blacklist + MIME |

---

## 🎨 Tech Stack

**Frontend:** Vue 3, Vite, TailwindCSS, Lucide Icons
**Backend:** Node.js, Express, bcrypt, multer
**Bot:** Telegraf, axios

---

## 📦 Production

```bash
npm run build:frontend
cd server && NODE_ENV=production npm start
cd telegram-bot && npm start
```

---

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

---

## 📄 License

MIT License - see `LICENSE`

---

<div align="center">

### ⭐ Star us on GitHub!

Made with ❤️ and ☕

</div>

---
---

# 🇷🇺 Русский

## 🎯 О проекте

**SecureFileShare** — современный сервис обмена файлами с **E2E шифрованием** и **Telegram интеграцией**. Отправляйте файлы через веб или бота — **ссылки работают везде!**

### ✨ Ключевые особенности

<table>
<tr>
<td width="50%">

#### 🌐 Веб-интерфейс
- 🎨 Современный UI (темная/светлая)
- 📱 Адаптивный дизайн
- 🌍 Мультиязычность (RU/EN)
- ⚡ Быстрый Vue 3

</td>
<td width="50%">

#### 🤖 Telegram Bot
- 💬 Полный функционал в мессенджере
- 🔗 **Единые ссылки** с веб-версией
- 📲 Удобные кнопки
- 🌐 Два языка

</td>
</tr>
</table>

### 🔒 Безопасность

- ✅ **AES-256** шифрование паролей
- ✅ Защита от **CSRF, XSS, Path Traversal**
- ✅ **Rate Limiting** против DDoS
- ✅ Валидация файлов (MIME + magic numbers)
- ✅ Полная **анонимность** — без регистрации

### ⚡ Уникальные возможности

| Функция | Описание |
|---------|----------|
| 🔗 **Единые ссылки** | Загрузка через бот → скачивание на сайте, и наоборот |
| ⏰ **Автоудаление** | По времени (1-30 дней) или скачиваниям (1-100) |
| 🔐 **Пароль** | Опциональное шифрование |
| 📄 **Текст** | Заметки с подсветкой синтаксиса |
| 🎯 **Без регистрации** | Полностью анонимно |

---

## 📸 Скриншоты

<div align="center">

### Веб-интерфейс

<img src=".github/assets/web-upload.png" width="45%" alt="Загрузка">
<img src=".github/assets/web-download.png" width="45%" alt="Скачивание">

### Telegram Bot

<img src=".github/assets/bot-menu.png" width="45%" alt="Меню бота">
<img src=".github/assets/bot-upload.png" width="45%" alt="Загрузка через бота">

</div>

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 18+ ([Скачать](https://nodejs.org/))
- **npm** или **yarn**
- **Telegram Bot Token** (от [@BotFather](https://t.me/BotFather))

### ⚡ Установка за 3 шага

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/haha7788/secure-file-share.git
cd secure-file-share

# 2. Установите зависимости
npm run install:all

# 3. Настройте окружение
cp server/.env.example server/.env
cp telegram-bot/.env.example telegram-bot/.env
cp frontend/.env.example frontend/.env

# Добавьте BOT_TOKEN в telegram-bot/.env
```

### 🎬 Запуск

Откройте **3 терминала**:

```bash
# Terminal 1: Backend
npm run dev:server
# ➜ http://localhost:3000

# Terminal 2: Frontend
npm run dev:frontend
# ➜ http://localhost:5173

# Terminal 3: Telegram Bot
npm run dev:bot
# ➜ Bot running...
```

**Готово! 🎉** Откройте `http://localhost:5173`

---

## 📁 Структура проекта

```
secure-file-share/
│
├── 🌐 frontend/          # Vue 3 + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # Vue компоненты
│   │   ├── composables/  # Переиспользуемая логика
│   │   └── locales/      # Переводы
│   └── .env.example
│
├── 🔧 server/            # Express.js API
│   ├── src/
│   │   ├── routes/       # API маршруты
│   │   ├── middleware/   # Auth, CORS и т.д.
│   │   ├── services/     # Бизнес-логика
│   │   ├── validators/   # Безопасность
│   │   └── utils/        # Утилиты
│   ├── uploads/          # Файлы пользователей
│   └── data/             # Метаданные
│
└── 🤖 telegram-bot/      # Telegraf бот
    ├── src/
    │   ├── handlers/     # Команды
    │   ├── keyboards/    # Inline кнопки
    │   ├── locales/      # Переводы
    │   └── services/     # API клиент
    └── temp/             # Временные файлы
```

---

## 🔌 API Документация

### Upload файла

```bash
POST /upload

curl -X POST http://localhost:3000/upload \
  -F "file=@document.pdf" \
  -F "expiry=7" \
  -F "password=secret123" \
  -F "deleteAfter=5"

# Ответ
{
  "success": true,
  "id": "abc123xyz",
  "url": "http://localhost:5173/file/abc123xyz",
  "expiryDate": "2025-01-06T12:00:00.000Z"
}
```

### Upload текста

```bash
POST /upload/text

curl -X POST http://localhost:3000/upload/text \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Заметка",
    "content": "Секретный текст",
    "expiry": 7,
    "password": "secret123"
  }'
```

### Download файла

```bash
GET /download/:id?password=secret123

curl http://localhost:3000/download/abc123xyz?password=secret123 \
  -o file.pdf
```

---

## 🤖 Telegram Bot

### Команды

| Команда | Описание |
|---------|----------|
| `/start` | Главное меню |
| `/help` | Справка |
| `/upload` | Загрузить файл/текст |
| `/download` | Скачать по ссылке |

### Получение токена

1. Напишите [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен в `telegram-bot/.env`

```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

---

## ⚙️ Конфигурация

<details>
<summary><b>server/.env</b></summary>

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=1073741824    # 1 GB
MAX_TEXT_SIZE=2097152        # 2 MB
```
</details>

<details>
<summary><b>telegram-bot/.env</b></summary>

```env
BOT_TOKEN=ваш_токен_бота
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```
</details>

<details>
<summary><b>frontend/.env</b></summary>

```env
VITE_API_URL=http://localhost:3000
```
</details>

---

## 🛡️ Безопасность

| Защита | Реализация |
|--------|------------|
| **CSRF** | Token + Origin check |
| **XSS** | CSP + Санитизация |
| **Path Traversal** | Валидация имен |
| **Brute Force** | Rate limiting |
| **Пароли** | bcrypt (10 раундов) |
| **Загрузка** | Blacklist + MIME |

---

## 🎨 Технологии

**Frontend:** Vue 3, Vite, TailwindCSS, Lucide Icons
**Backend:** Node.js, Express, bcrypt, multer
**Bot:** Telegraf, axios

---

## 📦 Production

```bash
npm run build:frontend
cd server && NODE_ENV=production npm start
cd telegram-bot && npm start
```

---

## 🤝 Contributing

Pull request'ы приветствуются! Для больших изменений создайте Issue.

---

## 📄 Лицензия

MIT License - см. `LICENSE`

---

<div align="center">

### ⭐ Поставьте звезду на GitHub!

Made with ❤️ and ☕

</div>
