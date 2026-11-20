import { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Volume2,
  Download,
  X,
  Loader2,
  Languages,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { translateText } from '../services/translationService';
import { speakText } from '../services/speechService';
import LanguageSelector from './LanguageSelector';

export default function Translator({ languages, addToHistory, reuseData, onReuseConsumed }) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);
  const [provider, setProvider] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (reuseData) {
      setSourceText(reuseData.sourceText || '');
      setCharCount((reuseData.sourceText || '').length);
      setTranslatedText(reuseData.translatedText || '');
      if (reuseData.sourceLang && reuseData.sourceLang !== 'auto') setSourceLang(reuseData.sourceLang);
      if (reuseData.targetLang) setTargetLang(reuseData.targetLang);
      setDetectedLang(reuseData.detectedLang || null);
      onReuseConsumed?.();
    }
  }, [reuseData, onReuseConsumed]);

  const handleSourceChange = (e) => {
    setSourceText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setCharCount(translatedText.length);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }
    if (sourceLang === targetLang && sourceLang !== 'auto') {
      setError('Source and target languages are the same');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateText({
        text: sourceText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      setTranslatedText(result.translatedText);
      const detected = result.detectedSourceLanguage || null;
      setDetectedLang(detected);
      setProvider(result.provider || null);

      addToHistory({
        sourceText,
        translatedText: result.translatedText,
        sourceLang,
        targetLang,
        detectedLang: detected,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    speakText(translatedText, targetLang, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: (msg) => {
        setSpeaking(false);
        console.warn('Audio TTS:', msg);
      },
    });
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${targetLang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickTexts = [
    "Hello, nice to meet you!",
    "Where is the nearest train station?",
    "Can you please help me?"
  ];

  return (
    <section className="translator-section" id="translator">
      <div className="hero-banner">
        <h1 className="hero-title">
          Break Language Barriers Instantly
        </h1>
        <p className="hero-subtitle">
          Translate seamlessly between 100+ languages with high accuracy, instant text-to-speech, and automatic language detection.
        </p>
      </div>

      <div className="translator-card">
        <div className="language-bar">
          <div className="lang-group">
            <LanguageSelector
              languages={languages}
              value={sourceLang}
              onChange={setSourceLang}
              includeAuto={true}
              label="Source Language"
            />
          </div>

          <button
            className="swap-btn"
            onClick={handleSwap}
            disabled={sourceLang === 'auto'}
            title={sourceLang === 'auto' ? 'Cannot swap auto-detect' : 'Swap languages'}
            aria-label="Swap languages"
          >
            <ArrowLeftRight size={18} />
          </button>

          <div className="lang-group">
            <LanguageSelector
              languages={languages}
              value={targetLang}
              onChange={setTargetLang}
              label="Target Language"
            />
          </div>
        </div>

        <div className="panels">
          <div className="panel panel-left">
            <div className="panel-header">
              <span className="panel-tag">Input</span>
              {sourceText && (
                <button
                  className="icon-btn-sm clear-btn"
                  onClick={() => { setSourceText(''); setCharCount(0); }}
                  aria-label="Clear text"
                  title="Clear text"
                >
                  <X size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              className="translator-textarea"
              value={sourceText}
              onChange={handleSourceChange}
              onKeyDown={handleKeyDown}
              maxLength={5000}
              placeholder="Type, paste, or pick a sample text below..."
              aria-label="Source text"
            />

            {!sourceText && (
              <div className="quick-chips">
                <span className="chips-label">Quick samples:</span>
                {quickTexts.map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setSourceText(txt);
                      setCharCount(txt.length);
                    }}
                  >
                    "{txt}"
                  </button>
                ))}
              </div>
            )}

            <div className="panel-footer">
              <span className={`char-counter ${charCount > 4500 ? 'char-warn' : ''}`}>
                {charCount.toLocaleString()} / 5,000 characters
              </span>
              <span className="shortcut-tip">
                <Zap size={12} /> Press <strong>Ctrl + Enter</strong> to translate
              </span>
            </div>
          </div>

          <div className="panel panel-right">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="panel-tag target-tag">Translation</span>
                {detectedLang && (
                  <span className="detected-badge">
                    <Sparkles size={11} /> Detected: {detectedLang}
                  </span>
                )}
              </div>

              {translatedText && (
                <div className="output-actions">
                  <button
                    className={`action-pill ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    title="Copy translated text"
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    className={`action-pill ${speaking ? 'speaking' : ''}`}
                    onClick={handleSpeak}
                    title="Pronounce text"
                  >
                    <Volume2 size={14} />
                    <span>{speaking ? 'Playing...' : 'Listen'}</span>
                  </button>
                  <button
                    className="action-pill"
                    onClick={handleDownload}
                    title="Save as TXT file"
                  >
                    <Download size={14} />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            <div className={`translated-output ${!translatedText ? 'empty' : ''}`}>
              {isLoading ? (
                <div className="translating-loader">
                  <Loader2 size={28} className="spinning" />
                  <p>Translating text with neural models...</p>
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <div className="placeholder-state">
                  <Languages size={32} className="placeholder-icon" />
                  <p>Translation will appear here instantly</p>
                </div>
              )}
            </div>

            <div className="panel-footer right-footer">
              <span className="output-info">
                {translatedText ? `${translatedText.length} characters translated` : 'Ready to translate'}
              </span>
            </div>
          </div>
        </div>

        <div className="translate-row">
          <button
            className="translate-btn"
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinning" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages size={18} />
                <span>Translate Now</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} className="error-icon" />
            <div className="error-content">
              <strong>Translation Alert:</strong> {error}
            </div>
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
