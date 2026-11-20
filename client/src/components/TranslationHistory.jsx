import { Clock, Languages, Trash2, RotateCcw, ArrowRight } from 'lucide-react';

function truncate(text, max = 55) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function TranslationHistory({
  history,
  clearHistory,
  removeFromHistory,
  onReuse,
}) {
  return (
    <section id="history" className="history-section">
      <div className="history-header">
        <div className="history-title-group">
          <div className="history-badge">
            <Clock size={16} />
          </div>
          <div>
            <h2 className="history-title">Recent Translations</h2>
            <p className="history-sub">Quickly revisit and reuse your previous translations</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={clearHistory}
            aria-label="Clear all history"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Languages size={32} />
          </div>
          <p className="empty-title">No translation history yet</p>
          <span className="empty-desc">Your translated phrases will automatically be saved locally right here.</span>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-top">
                <span className="lang-pill">
                  {item.detectedLang ? `${item.detectedLang} (auto)` : item.sourceLang.toUpperCase()}
                  <ArrowRight size={12} className="pill-arrow" />
                  {item.targetLang.toUpperCase()}
                </span>
                <span className="history-time">{formatTimestamp(item.timestamp)}</span>
              </div>

              <div className="history-card-body">
                <p className="history-source" title={item.sourceText}>{truncate(item.sourceText)}</p>
                <p className="history-translated" title={item.translatedText}>{truncate(item.translatedText)}</p>
              </div>

              <div className="history-card-actions">
                <button
                  className="reuse-pill"
                  onClick={() => onReuse(item)}
                  title="Reuse this translation"
                >
                  <RotateCcw size={13} />
                  <span>Reuse</span>
                </button>
                <button
                  className="delete-icon-btn"
                  onClick={() => removeFromHistory(item.id)}
                  title="Remove from history"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
