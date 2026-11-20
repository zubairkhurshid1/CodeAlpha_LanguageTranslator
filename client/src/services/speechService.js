const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const SPEECH_LOCALE_MAP = {
  en: ['en-US', 'en-GB'],
  es: ['es-ES', 'es-MX', 'es-US'],
  fr: ['fr-FR', 'fr-CA'],
  de: ['de-DE'],
  it: ['it-IT'],
  pt: ['pt-BR', 'pt-PT'],
  ru: ['ru-RU'],
  zh: ['zh-CN', 'zh-TW', 'zh-HK'],
  ja: ['ja-JP'],
  ko: ['ko-KR'],
  ar: ['ar-SA', 'ar-EG', 'ar'],
  hi: ['hi-IN', 'hi'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  tr: ['tr-TR'],
  nl: ['nl-NL'],
  pl: ['pl-PL'],
  sv: ['sv-SE'],
  da: ['da-DK'],
  fi: ['fi-FI'],
  no: ['nb-NO', 'no-NO', 'no'],
  ur: ['ur-PK', 'ur-IN', 'ur'],
};

let activeAudio = null;

function streamBackendTTS(text, langCode, { onStart, onEnd, onError } = {}) {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio = null;
    }

    const ttsUrl = `${BASE_URL}/tts?text=${encodeURIComponent(text.slice(0, 300))}&lang=${encodeURIComponent(langCode)}`;
    const audio = new Audio(ttsUrl);
    activeAudio = audio;

    audio.onplay = () => onStart?.();
    audio.onended = () => {
      activeAudio = null;
      onEnd?.();
    };
    audio.onerror = (e) => {
      activeAudio = null;
      console.warn('Backend TTS error:', e);
      onError?.('Audio stream could not be loaded');
      onEnd?.();
    };

    audio.play().catch((err) => {
      console.warn('Playback error:', err);
      onError?.(err.message);
      onEnd?.();
    });
  } catch (err) {
    onError?.(err.message);
    onEnd?.();
  }
}

export function speakText(text, langCode, { onStart, onEnd, onError } = {}) {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (langCode === 'ur' || !('speechSynthesis' in window)) {
    streamBackendTTS(text, langCode, { onStart, onEnd, onError });
    return;
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const candidateLocales = SPEECH_LOCALE_MAP[langCode] || [langCode];

  const hasInstalledVoice = voices.some((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return candidateLocales.some((loc) => vLang === loc.toLowerCase() || vLang.startsWith(langCode.toLowerCase()));
  });

  if (!hasInstalledVoice) {
    streamBackendTTS(text, langCode, { onStart, onEnd, onError });
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = candidateLocales[0];

  const matchedVoice = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return candidateLocales.some((loc) => vLang === loc.toLowerCase() || vLang.startsWith(langCode.toLowerCase()));
  });

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') {
      onEnd?.();
      return;
    }
    streamBackendTTS(text, langCode, { onStart, onEnd, onError });
  };

  window.speechSynthesis.speak(utterance);
}
