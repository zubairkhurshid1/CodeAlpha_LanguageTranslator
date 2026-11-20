const { Router } = require('express');
const axios = require('axios');
const { translateText, getSupportedLanguages } = require('../services/myMemoryTranslate');

const router = Router();

router.post('/translate', async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;

  if (
    !text ||
    typeof text !== 'string' ||
    text.trim().length === 0
  ) {
    return res.status(400).json({ error: 'text must be a non-empty string.' });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: 'text must not exceed 5000 characters.' });
  }

  if (
    !targetLanguage ||
    typeof targetLanguage !== 'string' ||
    targetLanguage.trim().length === 0
  ) {
    return res.status(400).json({ error: 'targetLanguage must be a non-empty string.' });
  }

  try {
    const result = await translateText({ text, targetLanguage, sourceLanguage });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Translation error:', err.message);
    const status = err.message.includes('limit') || err.message.includes('quota') ? 429 : 500;
    return res.status(status).json({ error: err.message || 'Translation failed. Please try again.' });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await getSupportedLanguages();
    return res.status(200).json({ languages });
  } catch (err) {
    console.error('Languages fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch languages.' });
  }
});

router.get('/tts', async (req, res) => {
  const { text, lang } = req.query;

  if (!text || !lang) {
    return res.status(400).json({ error: 'text and lang parameters are required' });
  }

  try {
    const cleanText = encodeURIComponent(String(text).slice(0, 300));
    const cleanLang = encodeURIComponent(String(lang));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=${cleanLang}&client=tw-ob`;

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
      timeout: 10000,
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'public, max-age=86400',
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('TTS Proxy Error:', error.message);
    return res.status(500).json({ error: 'Audio speech generation failed' });
  }
});

module.exports = router;
