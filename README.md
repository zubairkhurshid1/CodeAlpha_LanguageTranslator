# 🌐 LinguaAI — Language Translation Tool

> Free & Open-Source Language Translation Web Application

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MyMemory API](https://img.shields.io/badge/API-MyMemory%20Translation-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A modern, responsive, and production-ready language translation web application powered exclusively by the **MyMemory Translation API**. Built with React, Vite, Node.js, and Express. No credit card, billing accounts, or paid API keys required.

---

## ✨ Features

- 🌍 Translate text between multiple world languages (English, Spanish, French, German, Urdu, Arabic, Chinese, Japanese, and more)
- 🔍 Auto-detect source language
- 🔄 Swap source and target languages instantly
- 📋 Copy translated text to clipboard with 1-click feedback
- 🔊 Natural text-to-speech voice pronunciation
- ⬇️ Download translations as `.txt` files
- 📜 Local translation history with quick reuse
- ⌨️ Keyboard shortcut: `Ctrl + Enter` (or `Cmd + Enter`) to translate
- 🌙 High-contrast Light and Dark mode toggle
- 📱 Responsive layout optimized for mobile, tablet, and desktop
- ⚡ Rate limiting and clear error handling for network limits and unsupported requests
- 🆓 **100% Free**: Powered by MyMemory API without Google Cloud billing or payment cards

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component architecture |
| **Vite 5** | Frontend build tool and rapid dev server |
| **JavaScript (ES6+)** | Modern client and server code |
| **CSS3** | Responsive design with theme variables |
| **Lucide React** | Icons |
| **Node.js 18+** | Backend server runtime |
| **Express.js 4** | RESTful backend framework |
| **MyMemory API** | Free machine translation service |
| **Axios** | Backend HTTP client |
| **Web Speech API** | Client-side audio pronunciation |
| **dotenv & CORS** | Environment & security management |

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
│       │   ├── translationService.js
│       │   └── speechService.js
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
│   │   └── myMemoryTranslate.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher) and `npm`
- No payment card, billing, or external account setup required!

### 1. Clone or Open the Repository

```bash
cd "codealpha-language-translator"
```

### 2. Backend Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

> The server will start on **http://localhost:5000**

### 3. Frontend Setup

In a new terminal window:

```bash
cd client
npm install
npm run dev
```

> The web app will open at **http://localhost:5173**

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

*(No API keys or billing credentials needed!)*

### Frontend (`client/.env` — Optional for production)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🌐 How the MyMemory API Integration Works

All translation requests are routed through the secure Express backend (`POST /api/translate`) to prevent CORS restrictions and keep the client-side clean:

1. The frontend sends:
   ```json
   {
     "text": "Hello world",
     "sourceLanguage": "en",
     "targetLanguage": "es"
   }
   ```
2. The backend sends a request to MyMemory API:
   ```
   https://api.mymemory.translated.net/get?q=Hello%20world&langpair=en|es
   ```
3. MyMemory translates the string and returns the JSON payload.
4. The backend formats and returns:
   ```json
   {
     "translatedText": "Hola mundo",
     "detectedSourceLanguage": "en"
   }
   ```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project into [Vercel](https://vercel.com) and set **Root Directory** to `client`.
3. Add environment variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).
4. Click Deploy.

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command:** `npm install` and **Start Command:** `node server.js`.
4. Add environment variables:
   - `PORT=5000`
   - `CLIENT_ORIGIN=https://your-frontend.vercel.app`
5. Click Deploy.

---

## 📄 License

MIT License — see LICENSE for details.
