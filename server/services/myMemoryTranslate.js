const axios = require('axios');

const MYMEMORY_BASE_URL = 'https://api.mymemory.translated.net/get';

const SUPPORTED_LANGUAGES = [
  { language: 'en', name: 'English' },
  { language: 'es', name: 'Spanish' },
  { language: 'fr', name: 'French' },
  { language: 'de', name: 'German' },
  { language: 'it', name: 'Italian' },
  { language: 'pt', name: 'Portuguese' },
  { language: 'ru', name: 'Russian' },
  { language: 'zh', name: 'Chinese' },
  { language: 'ja', name: 'Japanese' },
  { language: 'ko', name: 'Korean' },
  { language: 'ar', name: 'Arabic' },
  { language: 'hi', name: 'Hindi' },
  { language: 'bn', name: 'Bengali' },
  { language: 'tr', name: 'Turkish' },
  { language: 'nl', name: 'Dutch' },
  { language: 'pl', name: 'Polish' },
  { language: 'sv', name: 'Swedish' },
  { language: 'da', name: 'Danish' },
  { language: 'fi', name: 'Finnish' },
  { language: 'no', name: 'Norwegian' },
  { language: 'ur', name: 'Urdu (اردو)' }
];

async function translateText({ text, targetLanguage, sourceLanguage }) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text to translate is required and cannot be empty.');
  }

  if (text.length > 5000) {
    throw new Error('Text exceeds maximum limit of 5000 characters.');
  }

  if (!targetLanguage || typeof targetLanguage !== 'string') {
    throw new Error('Target language is required.');
  }

  const src = (!sourceLanguage || sourceLanguage === 'auto') ? 'autodetect' : sourceLanguage.trim();
  const tgt = targetLanguage.trim();

  if (src !== 'autodetect' && src.toLowerCase() === tgt.toLowerCase()) {
    throw new Error('Source and target languages cannot be the same.');
  }

  const langpair = `${src}|${tgt}`;

  try {
    const response = await axios.get(MYMEMORY_BASE_URL, {
      params: {
        q: text,
        langpair,
      },
      timeout: 10000,
    });

    const data = response.data;

    if (!data) {
      throw new Error('Empty response received from MyMemory Translation API.');
    }

    if (data.responseStatus === 403 || data.responseStatus === 429) {
      throw new Error(data.responseDetails || 'MyMemory daily query limit reached. Please try again later.');
    }

    if (data.responseData && typeof data.responseData.translatedText === 'string') {
      let detectedSourceLanguage = null;
      if (src === 'autodetect') {
        if (data.matches && data.matches.length > 0 && data.matches[0]['created-by']) {
          detectedSourceLanguage = data.matches[0]['source'] || 'auto-detected';
        } else {
          detectedSourceLanguage = 'auto-detected';
        }
      } else {
        detectedSourceLanguage = src;
      }

      return {
        translatedText: data.responseData.translatedText,
        detectedSourceLanguage,
      };
    }

    throw new Error(data.responseDetails || 'Translation failed. Please try again.');
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 429 || status === 403) {
        throw new Error('MyMemory API quota or rate limit exceeded. Please wait a moment.');
      }
      throw new Error(`MyMemory API error: ${error.response.data?.responseDetails || error.message}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Translation request timed out. Please check your internet connection.');
    } else {
      throw error;
    }
  }
}

async function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

module.exports = {
  translateText,
  getSupportedLanguages,
  SUPPORTED_LANGUAGES,
};
