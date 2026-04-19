import { useEffect } from 'react';
import { Download, FolderOpen, Settings, Package, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router';
import { useI18n } from '../i18n';

export default function ExtensionGuide() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useI18n();

  const steps = [
    {
      image: "/assets/guide/step_download.png",
      title: "Step 1: Download & Save",
      desc: "Click the secure button below to download the official ClipVora extension package. It comes as a safe ZIP file containing all necessary assets.",
      action: <a href="/clipvora-extension.zip" download="clipvora-extension.zip" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', textDecoration: 'none' }}>Download Extension ZIP</a>
    },
    {
      image: "/assets/guide/step_extract.png",
      title: "Step 2: Extract the Package",
      desc: "Locate the 'clipvora-extension.zip' in your downloads. Right-click it and select 'Extract All'. This will create a folder with the extension files inside.",
    },
    {
      image: "/assets/guide/step_chrome.png",
      title: "Step 3: Access Extensions Manager",
      desc: "Open a new tab in Google Chrome, type 'chrome://extensions' in the address bar, and hit Enter. This is where you manage your browser tools.",
    },
    {
      image: "/assets/guide/step_load.png",
      title: "Step 4: Load into Browser",
      desc: "Enable 'Developer mode' in the top right corner. Click the 'Load unpacked' button that appears, and select the folder you extracted in Step 2.",
    }
  ];

  return (
    <div className="guide-page">
      <header className="guide-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="guide-badge"><Info size={14} /> Quick Setup Guide</div>
            <h1>Install <span className="highlight">ClipVora</span> in Seconds</h1>
            <p>Our companion extension makes media extraction seamless. Follow this simple 4-step guide to get started.</p>
          </motion.div>
        </div>
      </header>

      <section className="guide-steps">
        <div className="container">
          <div className="steps-vertical">
            {steps.map((s, i) => (
              <motion.div 
                key={i} 
                className="guide-step-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-image-container">
                    <img src={s.image} alt={s.title} className="step-3d-image" />
                </div>
                <div className="step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {s.action}
                  <div className="step-connect-line"></div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="guide-success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <CheckCircle2 size={56} className="success-icon" />
            <h2>Ready to Download!</h2>
            <p>Visit YouTube, Instagram, or any of our 50+ supported sites. The ClipVora icon in your toolbar will now handle everything for you automatically.</p>
            <div style={{ marginTop: 32 }}>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="btn-primary" 
                  style={{ 
                    background: 'white', 
                    color: '#22c55e', 
                    boxShadow: 'none', 
                    margin: '0 auto', 
                    fontSize: '1.1rem',
                    position: 'relative',
                    zIndex: 100,
                    cursor: 'pointer'
                  }}
                >
                  Go to Home Page
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="guide-faq section">
        <div className="container">
            <h2 className="section-title">Why the Manual Installation?</h2>
            <p className="section-subtitle">We are currently in the process of joining the official Chrome Web Store. For now, this developer-mode method gives you full access to all premium features.</p>
            <div className="card-grid">
                <div className="card">
                    <div className="icon-box" style={{ background: '#dcfce7', color: '#22c55e' }}><Settings size={32} /></div>
                    <h3>Developer Mode</h3>
                    <p>Enabling developer mode is safe and required for manual extension loading.</p>
                </div>
                <div className="card">
                    <div className="icon-box" style={{ background: '#e0e7ff', color: '#6366f1' }}><FolderOpen size={32} /></div>
                    <h3>Keep the Folder</h3>
                    <p>Do not delete the extracted folder! The extension runs directly from those files.</p>
                </div>
                <div className="card">
                    <div className="icon-box" style={{ background: '#fff7ed', color: '#f97316' }}><Package size={32} /></div>
                    <h3>One-Time Setup</h3>
                    <p>You only need to do this once. The extension will stay in your browser until you remove it.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
