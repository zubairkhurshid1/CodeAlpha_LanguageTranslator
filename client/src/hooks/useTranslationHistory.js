import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lingua-history';
const MAX_HISTORY = 20;

export function useTranslationHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry) => {
    setHistory(prev => {
      const updated = [{ ...entry, id: Date.now() }, ...prev].slice(0, MAX_HISTORY);
      return updated;
    });
  };

  const clearHistory = () => setHistory([]);

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return { history, addToHistory, clearHistory, removeFromHistory };
}
