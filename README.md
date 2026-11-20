# 🌐 LinguaAI — Language Translation Tool

> CodeAlpha Artificial Intelligence Internship — Task 1

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A beautiful, production-ready language translation web application. Built with React, Vite, Node.js, and Express.

---

## ✨ Features

- 🌍 Translate text between 100+ languages
- 🔍 Auto-detect source language
- 🔄 Swap source and target languages
- 📋 Copy translated text to clipboard
- 🔊 Text-to-speech for translated output
- ⬇️ Download translation as .txt file
- 📜 Translation history (saved in localStorage, up to 20 entries)
- ♻️ Reuse previous translations
- ⌨️ Keyboard shortcut: Ctrl+Enter to translate
- 🌙 Light / Dark mode toggle
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Loading indicators and error handling

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **Vite 5** | Frontend build tool & dev server |
| **JavaScript ES6+** | Frontend language |
| **CSS3 (custom properties)** | Styling with theme support |
| **Lucide React** | Icon library |
| **Node.js 18+** | Backend runtime |
| **Express.js 4** | Backend web framework |
| **Axios** | HTTP client |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin request handling |
---

## 📁 Project Structure

```
codealpha-language-translator/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Translator.jsx
│       │   ├── LanguageSelector.jsx
│       │   ├── TranslationHistory.jsx
│       │   └── Footer.jsx
│       ├── services/
│       │   └── translationService.js
│       ├── hooks/
│       │   ├── useTheme.js
│       │   └── useTranslationHistory.js
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── server/
│   ├── routes/
│   │   └── translate.js
│   ├── services/
│   │   └── googleTranslate.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Cloud account with billing enabled

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codealpha-language-translator.git
cd codealpha-language-translator
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

> Server runs at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

> App runs at **http://localhost:5173**

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`client/.env` — only for production deployment)


---
