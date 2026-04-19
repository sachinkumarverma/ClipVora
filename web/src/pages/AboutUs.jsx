import { useEffect } from 'react';
import { Heart, Shield, Globe, Smartphone, Download, Zap, CheckCircle2, Play, Music, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';

export default function AboutUs() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useI18n();

  const values = [
    { icon: <Zap size={24} />, title: t('aboutVal1Title'), desc: t('aboutVal1Desc') },
    { icon: <Shield size={24} />, title: t('aboutVal2Title'), desc: t('aboutVal2Desc') },
    { icon: <Globe size={24} />, title: t('aboutVal3Title'), desc: t('aboutVal3Desc') },
    { icon: <Smartphone size={24} />, title: t('aboutVal4Title'), desc: t('aboutVal4Desc') },
    { icon: <Download size={24} />, title: t('aboutVal5Title'), desc: t('aboutVal5Desc') },
    { icon: <Monitor size={24} />, title: t('aboutVal6Title'), desc: t('aboutVal6Desc') },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="about-hero-badge">
              <Heart size={14} /> {t('aboutBadge')}
            </div>
            <h1>
              {t('aboutTitle')} <span className="highlight">ClipVora</span>
            </h1>
            <p className="about-hero-sub">
              {t('aboutTagline')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <section className="about-mission">
        <div className="container">
          <motion.div
            className="about-mission-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="about-mission-icon">
              <Play size={28} />
            </div>
            <h2>{t('aboutMissionTitle')}</h2>
            <p>{t('aboutMissionP1')}</p>
            <p>{t('aboutMissionP2')}</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title">{t('aboutWhyTitle')}</h2>
          <p className="section-subtitle">{t('aboutWhySubtitle')}</p>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="about-value-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="about-commitment">
        <div className="container">
          <motion.div
            className="about-commitment-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="about-commitment-header">
              <Shield size={28} />
              <h2>{t('aboutCommitTitle')}</h2>
            </div>
            <p>{t('aboutCommitDesc')}</p>
            <div className="about-promise-list">
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise1')}</span>
              </div>
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise2')}</span>
              </div>
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise3')}</span>
              </div>
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise4')}</span>
              </div>
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise5')}</span>
              </div>
              <div className="about-promise">
                <CheckCircle2 size={18} />
                <span>{t('aboutPromise6')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tagline */}
      <section className="about-tagline">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2><span className="highlight">ClipVora</span> — {t('aboutTagline')}</h2>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
