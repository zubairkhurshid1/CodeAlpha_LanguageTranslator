import { useState, useEffect } from 'react';
import { Globe, Moon, Sun, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  const [activeNav, setActiveNav] = useState('translator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const historyEl = document.getElementById('history');
      const aboutEl = document.getElementById('about');

      if (aboutEl && scrollY + 400 >= aboutEl.offsetTop) {
        setActiveNav('about');
      } else if (historyEl && scrollY + 300 >= historyEl.offsetTop) {
        setActiveNav('history');
      } else {
        setActiveNav('translator');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#translator" className="logo" onClick={() => setActiveNav('translator')}>
          <div className="logo-badge">
            <Globe size={22} className="logo-icon" />
          </div>
          <div className="logo-brand">
            <span className="logo-text">LinguaAI</span>
          </div>
        </a>

        <nav className="nav-links">
          <a
            href="#translator"
            className={`nav-link ${activeNav === 'translator' ? 'active' : ''}`}
            onClick={() => setActiveNav('translator')}
          >
            Translator
          </a>
          <a
            href="#history"
            className={`nav-link ${activeNav === 'history' ? 'active' : ''}`}
            onClick={() => setActiveNav('history')}
          >
            History
          </a>
          <a
            href="#about"
            className={`nav-link ${activeNav === 'about' ? 'active' : ''}`}
            onClick={() => setActiveNav('about')}
          >
            About
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>

          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <a
            href="#translator"
            className={`mobile-nav-link ${activeNav === 'translator' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('translator');
              setMobileMenuOpen(false);
            }}
          >
            Translator
          </a>
          <a
            href="#history"
            className={`mobile-nav-link ${activeNav === 'history' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('history');
              setMobileMenuOpen(false);
            }}
          >
            History
          </a>
          <a
            href="#about"
            className={`mobile-nav-link ${activeNav === 'about' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('about');
              setMobileMenuOpen(false);
            }}
          >
            About
          </a>
        </div>
      )}
    </header>
  );
}
