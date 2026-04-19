import { useState } from 'react';
import { Routes, Route, Link } from 'react-router';
import { Video, Music, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Downloader from './components/Downloader';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PlatformPage from './pages/PlatformPage';
import ExtensionGuide from './pages/ExtensionGuide';
import platforms from './platformConfig';
import { useI18n } from './i18n';

function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <header className="hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hero-badge"><Zap size={14} /> {t('heroBadge')}</div>
            <h1>{t('heroTitle1')} <span className="highlight">ClipVora</span></h1>
            <p>{t('heroDesc')}</p>
          </motion.div>
        </div>
      </header>

      <Downloader placeholder={t('searchPlaceholder')} />

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">{t('featuresTitle')}</h2>
          <p className="section-subtitle">{t('featuresSubtitle')}</p>
          <div className="card-grid">
            <div className="card">
              <div className="icon-box" style={{ background: '#dcfce7', color: '#22c55e' }}><Video size={32} /></div>
              <h3>{t('fullVideos')}</h3>
              <p>{t('fullVideosDesc')}</p>
            </div>
            <div className="card">
              <div className="icon-box" style={{ background: '#e0e7ff', color: '#6366f1' }}><Music size={32} /></div>
              <h3>{t('audioOnly')}</h3>
              <p>{t('audioOnlyDesc')}</p>
            </div>
            <div className="card">
              <div className="icon-box" style={{ background: '#fff7ed', color: '#f97316' }}><Zap size={32} /></div>
              <h3>{t('instantSpeed')}</h3>
              <p>{t('instantSpeedDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-to" className="steps-section">
        <div className="container">
          <h2 className="section-title">{t('howToUse')}</h2>
          <p className="section-subtitle">{t('howToSubtitle')}</p>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-num">1</div>
              <span className="step-label">{t('step1')}</span>
              <h4>{t('step1Title')}</h4>
              <p>{t('step1Desc')}</p>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <span className="step-label">{t('step2')}</span>
              <h4>{t('step2Title')}</h4>
              <p>{t('step2Desc')}</p>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <span className="step-label">{t('step3')}</span>
              <h4>{t('step3Title')}</h4>
              <p>{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="platforms" className="platforms-section">
        <div className="container">
          <h2 className="section-title">{t('supportedPlatforms')}</h2>
          <p className="section-subtitle">{t('supportedPlatformsDesc')}</p>
          <div className="platforms-grid home-platforms-grid">
            {platforms.map((p) => (
              <Link to={p.path} key={p.key} className="platform-card-link">
                <div className="platform-card">
                  <div className="platform-icon-img"><img src={p.logo} alt={p.name} /></div>
                  <div className="platform-card-body">
                    <h4>{p.name} {t('downloader')}</h4>
                    <p>{p.features.slice(0, 2).join(', ')}</p>
                  </div>
                  <ArrowRight size={18} className="platform-card-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'app-dark' : ''} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/extension-guide" element={<ExtensionGuide />} />
          <Route path="/:platform" element={<PlatformPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
