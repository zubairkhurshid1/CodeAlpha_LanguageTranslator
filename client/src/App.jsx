import { useState, useEffect } from 'react'
import Header from './components/Header'
import Translator from './components/Translator'
import TranslationHistory from './components/TranslationHistory'
import Footer from './components/Footer'
import { useTheme } from './hooks/useTheme'
import { useTranslationHistory } from './hooks/useTranslationHistory'
import { fetchLanguages, FALLBACK_LANGUAGES } from './services/translationService'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { history, addToHistory, clearHistory, removeFromHistory } = useTranslationHistory()
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES)
  const [reuseData, setReuseData] = useState(null)

  useEffect(() => {
    fetchLanguages()
      .then(data => {
        if (data.languages && data.languages.length > 0) {
          setLanguages(data.languages)
        }
      })
      .catch(() => {})
  }, [])

  const handleReuse = (item) => {
    setReuseData(item)
    document.getElementById('translator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Translator 
          languages={languages} 
          addToHistory={addToHistory}
          reuseData={reuseData}
          onReuseConsumed={() => setReuseData(null)}
        />
        <TranslationHistory
          history={history}
          clearHistory={clearHistory}
          removeFromHistory={removeFromHistory}
          onReuse={handleReuse}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
