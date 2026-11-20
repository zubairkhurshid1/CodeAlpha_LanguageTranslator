const axios = require('axios');

const GOOGLE_BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

const DEFAULT_LANGUAGES = [
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
  { language: 'ur', name: 'Urdu' }
];

async function translateWithFreeFallback({ text, targetLanguage, sourceLanguage }) {
  try {
    const src = (!sourceLanguage || sourceLanguage === 'auto') ? 'autodetect' : sourceLanguage;
    const langpair = `${src}|${targetLanguage}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;
    
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    
    if (data && data.responseData && data.responseData.translatedText) {
      return {
        translatedText: data.responseData.translatedText,
        detectedSourceLanguage: (!sourceLanguage || sourceLanguage === 'auto') ? 'auto-detected' : sourceLanguage,
      };
    }
    throw new Error('Fallback translation returned empty response');
  } catch (error) {
    throw new Error(`Translation error: ${error.message}`);
  }
}

async function translateText({ text, targetLanguage, sourceLanguage }) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_google_api_key_here') {
    return await translateWithFreeFallback({ text, targetLanguage, sourceLanguage });
  }

  const shouldOmitSource = !sourceLanguage || sourceLanguage === 'auto';
  const body = {
    q: text,
    target: targetLanguage,
    format: 'text',
    ...(shouldOmitSource ? {} : { source: sourceLanguage }),
  };

  try {
    const response = await axios.post(`${GOOGLE_BASE_URL}/translate`, body, {
      params: { key: apiKey },
    });

    const translation = response.data.data.translations[0];
    return {
      translatedText: translation.translatedText,
      detectedSourceLanguage: translation.detectedSourceLanguage || sourceLanguage || null,
    };
  } catch (err) {
    console.warn('Google Cloud Translation API error, falling back to free engine:', err.response?.data?.error?.message || err.message);
    return await translateWithFreeFallback({ text, targetLanguage, sourceLanguage });
  }
}

async function getSupportedLanguages(targetLocale = 'en') {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_google_api_key_here') {
    return DEFAULT_LANGUAGES;
  }

  try {
    const response = await axios.get(`${GOOGLE_BASE_URL}/languages`, {
      params: {
        key: apiKey,
        target: targetLocale,
      },
    });

    return response.data.data.languages.map(({ language, name }) => ({
      language,
      name,
    }));
  } catch (err) {
    console.warn('Could not fetch languages from Google, using default list:', err.message);
    return DEFAULT_LANGUAGES;
  }
}

module.exports = { translateText, getSupportedLanguages };
