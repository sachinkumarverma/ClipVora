import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import platforms from '../platformConfig';
import Downloader from '../components/Downloader';
import { useI18n } from '../i18n';

export default function PlatformPage() {
  const { platform: platformKey } = useParams();
  const platform = platforms.find(p => p.key === platformKey);
  const { t } = useI18n();

  useEffect(() => { window.scrollTo(0, 0); }, [platformKey]);

  if (!platform) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Platform not found</h2>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: 20 }}>{t('home')}</Link>
      </div>
    );
  }

  const otherPlatforms = platforms.filter(p => p.key !== platformKey);

  // Get translated platform texts
  const heroTitle = t(`${platformKey}Title`) || platform.heroTitle;
  const heroDesc = t(`${platformKey}Desc`) || platform.heroDesc;
  const placeholder = t(`${platformKey}Placeholder`) || platform.placeholder;

  return (
    <div className="platform-page">
      <header className="hero platform-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="platform-hero-logo"><img src={platform.logo} alt={platform.name} /></div>
            <h1>{heroTitle}</h1>
            <p>{heroDesc}</p>
          </motion.div>
        </div>
      </header>

      <Downloader placeholder={placeholder} />

      <section className="platform-features-section">
        <div className="container">
          <h2 className="section-title">{t('whatCanDownload')} {platform.name}</h2>
          <div className="platform-features-list">
            {platform.features.map((feat, i) => (
              <div key={i} className="platform-feature-item"><CheckCircle2 size={20} /><span>{feat}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="platforms-section">
        <div className="container">
          <h2 className="section-title">{t('otherPlatforms')}</h2>
          <p className="section-subtitle">{t('otherPlatformsDesc')}</p>
          <div className="platforms-grid">
            {otherPlatforms.map((p) => (
              <Link to={p.path} key={p.key} className="platform-card-link">
                <div className="platform-card">
                  <div className="platform-icon-img"><img src={p.logo} alt={p.name} /></div>
                  <div className="platform-card-body">
                    <h4>{p.name} {t('downloader')}</h4>
                    <p>{p.features.join(', ')}</p>
                  </div>
                  <ArrowRight size={18} className="platform-card-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
