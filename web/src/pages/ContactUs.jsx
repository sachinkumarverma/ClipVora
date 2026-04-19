import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';

export default function ContactUs() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="about-hero-badge">
              <MessageSquare size={14} /> {t('contactBadge')}
            </div>
            <h1>{t('contactTitle')}</h1>
            <p className="about-hero-sub">
              {t('contactHeroDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2>{t('contactConnect')}</h2>
              <p className="contact-info-desc">
                {t('contactConnectDesc')}
              </p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-card-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4>{t('contactEmailTitle')}</h4>
                    <a href="mailto:sachinv1410@gmail.com">sachinv1410@gmail.com</a>
                    <p>{t('contactEmailDesc')}</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4>{t('contactCompanyTitle')}</h4>
                    <span className="contact-company">{t('contactCompanyName')}</span>
                    <p>{t('contactCompanyDesc')}</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon" style={{ background: '#fff7ed', color: '#f97316' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4>{t('contactHoursTitle')}</h4>
                    <span className="contact-company">{t('contactHoursValue')}</span>
                    <p>{t('contactHoursDesc')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3>{t('contactSuccessTitle')}</h3>
                  <p>{t('contactSuccessDesc')}</p>
                  <button className="btn-primary" onClick={() => setSubmitted(false)}>
                    {t('contactSendAnother')}
                  </button>
                </div>
              ) : (
                <>
                  <h2>{t('contactFormTitle')}</h2>
                  <p className="contact-form-desc">{t('contactFormDesc')}</p>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="contact-form-row">
                      <div className="contact-field">
                        <label>{t('contactNameLabel')}</label>
                        <input type="text" placeholder={t('contactNamePlaceholder')} required />
                      </div>
                      <div className="contact-field">
                        <label>{t('contactEmailLabel')}</label>
                        <input type="email" placeholder={t('contactEmailPlaceholder')} required />
                      </div>
                    </div>
                    <div className="contact-field">
                      <label>{t('contactSubjectLabel')}</label>
                      <input type="text" placeholder={t('contactSubjectPlaceholder')} required />
                    </div>
                    <div className="contact-field">
                      <label>{t('contactMessageLabel')}</label>
                      <textarea rows={5} placeholder={t('contactMessagePlaceholder')} required />
                    </div>
                    <button type="submit" className="btn-primary contact-submit">
                      <Send size={18} /> {t('contactSend')}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
