const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const FALLBACK_LANGUAGES = [
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
  { language: 'ur', name: 'Urdu (اردو)' },
];

export async function translateText({ text, sourceLanguage, targetLanguage }) {
  const response = await fetch(`${BASE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Translation request failed' }));
    throw new Error(error.error || 'Translation request failed');
  }

  return response.json();
}

export async function fetchLanguages() {
  const response = await fetch(`${BASE_URL}/languages`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (error.code === 'API_KEY_MISSING') {
      return { languages: FALLBACK_LANGUAGES };
    }
    throw new Error(error.error || 'Failed to fetch languages');
  }

  return response.json();
}
