import { Link, useLocation } from 'react-router';
import { Menu, X, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import platforms from '../platformConfig';
import { useI18n, languages } from '../i18n';
import clipvoraLogo from '../assets/ClipVora.png';

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const { lang, setLanguage, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);

    // Smart Extension Detection
    const checkExtension = () => {
      if (document.documentElement.dataset.clipvoraInstalled === 'true') {
        setExtensionInstalled(true);
      }
    };
    checkExtension();
    const observer = new MutationObserver(checkExtension);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-clipvora-installed'] });

    return () => {
      document.removeEventListener('mousedown', handleClick);
      observer.disconnect();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const currentLang = languages.find(l => l.code === lang);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <img src={clipvoraLogo} alt="ClipVora" className="navbar-brand-logo" />
        <span className="brand-clip">Clip</span>
        <span className="brand-vora">Vora</span>
      </Link>

      {/* Desktop platform tabs */}
      <div className="navbar-center">
        <div className="navbar-platform-tabs">
          {platforms.map((p) => (
            <Link
              key={p.key}
              to={p.path}
              className={`navbar-platform-tab ${location.pathname === p.path ? 'active' : ''}`}
            >
              <img src={p.logo} alt={p.name} className="navbar-platform-logo" />
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right side: Home, Contact, dark mode, language */}
      <div className="navbar-right">
        <Link to="/" className={`navbar-nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('home')}</Link>
        <Link to="/contact" className={`navbar-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>{t('contact')}</Link>
        
        {!extensionInstalled && window.self === window.top && (
          <Link 
            to="/extension-guide" 
            className="navbar-nav-link" 
            style={{ color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="How to Install Extension"
          >
            <span className="dot" style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            Extension
          </Link>
        )}

        <button
          className="navbar-icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? t('lightMode') : t('darkMode')}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="navbar-lang-wrapper" ref={langRef}>
          <button className="navbar-lang-btn" onClick={() => setLangOpen(!langOpen)}>
            <Globe size={16} />
            <span>{currentLang?.label}</span>
            <ChevronDown size={14} className={`navbar-lang-chevron ${langOpen ? 'open' : ''}`} />
          </button>
          {langOpen && (
            <div className="navbar-lang-dropdown">
              {languages.map((l) => (
                <button
                  key={l.code}
                  className={`navbar-lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                >
                  <span className="navbar-lang-flag">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile toggle */}
      <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-controls">
            <button className="navbar-icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{darkMode ? t('lightMode') : t('darkMode')}</span>
            </button>
          </div>

          <div className="navbar-mobile-divider" />
          <div className="navbar-mobile-section-label">{t('platforms')}</div>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('home')}</Link>
          {platforms.map((p) => (
            <Link key={p.key} to={p.path} className={`navbar-mobile-platform ${location.pathname === p.path ? 'active' : ''}`}>
              <img src={p.logo} alt={p.name} className="navbar-mobile-platform-logo" />
              {p.name}
            </Link>
          ))}

          <div className="navbar-mobile-divider" />
          <div className="navbar-mobile-section-label">{t('pages')}</div>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>{t('about')}</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t('contact')}</Link>
          {!extensionInstalled && window.self === window.top && (
            <Link to="/extension-guide" className={location.pathname === '/extension-guide' ? 'active' : ''} style={{ color: '#22c55e', fontWeight: 'bold' }}>
               Extension Guide
            </Link>
          )}
          <Link to="/privacy" className={location.pathname === '/privacy' ? 'active' : ''}>{t('privacy')}</Link>
          <Link to="/terms" className={location.pathname === '/terms' ? 'active' : ''}>{t('terms')}</Link>

          <div className="navbar-mobile-divider" />
          <div className="navbar-mobile-section-label">{t('language')}</div>
          <div className="navbar-mobile-lang-grid">
            {languages.map((l) => (
              <button key={l.code} className={`navbar-mobile-lang-btn ${lang === l.code ? 'active' : ''}`} onClick={() => setLanguage(l.code)}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
