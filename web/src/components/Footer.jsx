import { Link } from 'react-router';
import { useI18n } from '../i18n';
import clipvoraLogo from '../assets/ClipVora.png';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <img src={clipvoraLogo} alt="ClipVora" className="footer-brand-logo" />
          <span className="brand-clip">Clip</span>
          <span className="brand-vora">Vora</span>
        </div>
        <p className="footer-tagline">{t('footerTagline')}</p>
        <div className="footer-links">
          <Link to="/">{t('home')}</Link>
          <Link to="/about">{t('about')}</Link>
          <Link to="/privacy">{t('privacy')}</Link>
          <Link to="/terms">{t('terms')}</Link>
          <Link to="/contact">{t('contact')}</Link>
        </div>
        <div className="footer-divider" />
        <p className="footer-copy">{t('footerCopy')}</p>
      </div>
    </footer>
  );
}
