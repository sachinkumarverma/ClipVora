import { useEffect } from 'react';
import { FileText, Mail, AlertTriangle, Scale, Shield, ChevronRight, BookOpen, Users, Globe } from 'lucide-react';
import { useI18n } from '../i18n';

export default function TermsOfService() {
  const { t } = useI18n();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      {/* Hero */}
      <div className="legal-hero">
        <div className="container">
          <div className="legal-hero-icon">
            <FileText size={32} />
          </div>
          <h1>{t('termsTitle')}</h1>
          <p className="legal-hero-sub">{t('termsHeroDesc')}</p>
          <div className="legal-meta">
            <span>Krishna Studios</span>
            <span className="legal-meta-dot" />
            <span>sachinv1410@gmail.com</span>
            <span className="legal-meta-dot" />
            <span>{t('lastUpdated')}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="legal-content">
          <div className="legal-intro">
            <p>
              Welcome to ClipVora! You can use ClipVora to download videos and other files from many popular sites.
              Please read these Terms of Service carefully before using our platform.
            </p>
          </div>

          {/* Section 1 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">1</div>
              <div>
                <h2>{t('termsS1Title')}</h2>
                <p className="legal-section-desc">{t('termsS1Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('termsS1_1')}</h4>
                  <p>
                    These Terms of Service ("Agreement" or "Terms of Service") are a legally binding agreement between you
                    ("User") and ClipVora ("we", "our" or "us") regarding the use of ClipVora and other related websites
                    owned and/or operated by ClipVora (collectively, the "Website"), products and services.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('termsS1_2')}</h4>
                  <p>
                    You may use the services provided through this website only if you accept all the terms and conditions.
                    By accessing, visiting, using, downloading, copying and/or joining (collectively, "using") the Service,
                    you understand and accept these Terms. If you do not agree to be bound by these Terms, please stop using
                    the Service and delete any copies you may have.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('termsS1_3')}</h4>
                  <p>
                    We may modify these Terms of Service at any time without notice. Please review these Terms periodically
                    to ensure that you understand all terms governing your use of the Site and Services.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><AlertTriangle size={16} /></div>
                <div>
                  <h4>{t('termsS1_4')}</h4>
                  <p>
                    No one under 18 is allowed to use the Services. You hereby warrant that you are at least 18 years old.
                    If you are under the age of 18, you may use the Service only with the approval of your parent or guardian.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><Users size={16} /></div>
                <div>
                  <h4>{t('termsS1_5')}</h4>
                  <p>
                    If you use the Services on behalf of a company or other entity then "you" includes you and that entity,
                    and you represent and warrant that you are an authorized representative of the entity with the authority
                    to bind the entity to these Terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">2</div>
              <div>
                <h2>{t('termsS2Title')}</h2>
                <p className="legal-section-desc">{t('termsS2Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-item">
                <div className="legal-item-marker"><BookOpen size={16} /></div>
                <div>
                  <h4>{t('termsS2_1')}</h4>
                  <p>
                    We grant you a non-exclusive, non-transferable, and limited right to access, non-publicly display, and
                    use the Service, including all content available therein on your computer or mobile device consistent
                    with these Terms. You may only access and use the Service for your personal and noncommercial use.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('termsS2_2')}</h4>
                  <p>
                    This grant is terminable by us at will for any reason and at our sole discretion, with or without prior
                    notice. You agree not to use or attempt to use the Service after said termination. Upon termination, all
                    other portions of these Terms shall survive.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('termsS2_3')}</h4>
                  <p>
                    Your use of the Service shall be limited by the rules, features and technical restrictions of the Service,
                    which may change from time to time in our sole discretion. You shall not attempt to use the Service in any
                    manner in which the Service is not intended or permitted to be used.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">3</div>
              <div>
                <h2>{t('termsS3Title')}</h2>
                <p className="legal-section-desc">{t('termsS3Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <ul className="legal-list">
                <li>The information provided via ClipVora is offered on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without any express or implied warranties or conditions.</li>
                <li>We may provide updates or upgrades to the website including bug fixes, new features, or other enhancements. However, we have no obligation to provide any updates.</li>
                <li>We may restrict or suspend your access to the ClipVora Services if, in our judgment, you have violated any provision of these Terms, without prior notice.</li>
                <li>We shall not be liable for any loss, damage, or other harm resulting from your use, misuse, inability to use, or reliance on the ClipVora Services.</li>
                <li>When accessing web pages or websites linked from the ClipVora Services, you may be subject to additional or different terms and conditions.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">4</div>
              <div>
                <h2>{t('termsS4Title')}</h2>
                <p className="legal-section-desc">{t('termsS4Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p className="legal-body-intro">
                You acknowledge that ClipVora is a general-purpose tool. ClipVora may only be used in accordance with law.
                We do not encourage, condone, induce, or allow any use that may be in violation of any law. We explicitly
                prohibit the use of ClipVora to download any content in violation of copyright laws.
              </p>

              <div className="legal-highlight-box">
                <AlertTriangle size={20} />
                <div>
                  <h4>{t('termsProhibited')}</h4>
                  <p>You agree not to engage in any of the following:</p>
                </div>
              </div>

              <ul className="legal-list">
                <li>Copying, distributing, or disclosing any part of ClipVora, including by any automated "scraping"</li>
                <li>Using any automated system including "robots," "spiders," or "offline readers" to access ClipVora</li>
                <li>Transmitting spam, chain letters, or other unsolicited email</li>
                <li>Attempting to interfere with or compromise the system integrity or security</li>
                <li>Taking any action that imposes an unreasonable or disproportionately large load on our infrastructure</li>
                <li>Uploading invalid data, viruses, worms, or other software agents</li>
                <li>Using ClipVora for any commercial solicitation purposes</li>
                <li>Interfering with the proper working of ClipVora</li>
                <li>Bypassing the measures we may use to prevent or restrict access to ClipVora</li>
                <li>Copying, imitating or using ClipVora without prior written consent</li>
              </ul>

              <p className="legal-body-intro" style={{ marginTop: 24 }}>
                You also agree not to download materials that are copyrighted, obscene, illegal, defamatory, harmful,
                or that would constitute a criminal offense or violate the rights of any party.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">5</div>
              <div>
                <h2>{t('termsS5Title')}</h2>
                <p className="legal-section-desc">{t('termsS5Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                Copyright, trademark and all other proprietary rights in the Website, ClipVora, Services, and Content rest
                with ClipVora and/or its licensors. You agree not to copy, republish, frame, transmit, modify, rent, lease,
                loan, sell, assign, distribute, license, sublicense, reverse engineer, or create derivative works based on the
                Content, Website, or Services.
              </p>
              <p>
                ClipVora disclaims any rights to trademarks, service marks, trade names, logos, copyright, patents, domain
                names or other intellectual property interests of third parties. You acknowledge and agree that we may use any
                feedback, suggestions, or ideas that you provide in connection with the Service, without any obligation to
                compensate you.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">6</div>
              <div>
                <h2>{t('termsS6Title')}</h2>
                <p className="legal-section-desc">{t('termsS6Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p className="legal-body-intro">
                It is our policy to respond to notices of alleged copyright infringement that comply with applicable
                international intellectual property law, including the Digital Millennium Copyright Act ("DMCA").
              </p>
              <p>If you believe that any of your copyrighted material is being infringed, please submit your claim to
                <strong> sachinv1410@gmail.com</strong> with the following information:</p>
              <ul className="legal-list">
                <li>Identification of the copyrighted work believed to be infringed</li>
                <li>Identification of the material believed to be infringing and its location</li>
                <li>Information that will allow us to contact you (address, telephone number, email)</li>
                <li>A statement of good faith belief that the use is not authorized</li>
                <li>A statement that the information is accurate and under penalty of perjury you are authorized to act</li>
                <li>A physical or electronic signature from the copyright holder or authorized representative</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">7</div>
              <div>
                <h2>{t('termsS7Title')}</h2>
                <p className="legal-section-desc">{t('termsS7Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                We retain a separate Privacy Policy and your assent to these Terms also signifies that you have read and
                understand the Privacy Policy. We reserve the right to amend the Privacy Policy at any time. Your continued
                use of the Service following such amendments will be deemed your acknowledgement of the Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">8</div>
              <div>
                <h2>{t('termsS8Title')}</h2>
                <p className="legal-section-desc">{t('termsS8Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                The Service may contain links to third party websites, advertisers, services, special offers or other
                activities that are not owned or controlled by us. We don't endorse or assume any responsibility for such
                third party sites. If you access any third party website from the Service, you do so at your own risk.
              </p>
              <p>
                You understand and acknowledge that using our Service you may be exposed to content that is inaccurate,
                offensive, or objectionable. We may at our sole discretion refuse to publish, remove, or block access to
                any content for any reason, with or without notice.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">9</div>
              <div>
                <h2>{t('termsS9Title')}</h2>
                <p className="legal-section-desc">{t('termsS9Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-highlight-box warning">
                <Scale size={20} />
                <div>
                  <h4>{t('termsDisclaimer')}</h4>
                  <p>
                    All content and services are provided <strong>"as is"</strong> and <strong>"as available"</strong>.
                    ClipVora expressly disclaims any representations or warranties of any kind, express or implied.
                  </p>
                </div>
              </div>
              <p>
                The use of the website or downloading of any products through the website is done at your own discretion
                and risk. You will be solely responsible for any damage to your computer system, loss of data, or other harm.
                ClipVora assumes no liability for any computer virus or similar software code downloaded from the website.
              </p>
              <p>
                In no event shall ClipVora or any of its affiliates be liable for any direct, indirect, consequential,
                punitive, special or incidental damages under any theory of liability, resulting from the use of, or
                inability to use the website or services.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">10</div>
              <div>
                <h2>{t('termsS10Title')}</h2>
                <p className="legal-section-desc">{t('termsS10Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                You agree to defend, indemnify and hold harmless the Service and its subsidiaries, agents, licensors, managers,
                and other affiliated companies from and against any and all claims, damages, obligations, losses, liabilities,
                costs or debt arising from: (a) your use of and access to the Service; (b) your violation of any part of these
                Terms; (c) your violation of any third-party right, applicable law, rule, or regulation. To the maximum extent
                permitted by law, you and we agree not to bring or participate in a class or representative action.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">11</div>
              <div>
                <h2>{t('termsS11Title')}</h2>
                <p className="legal-section-desc">{t('termsS11Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                The term of this Agreement shall be effective upon your commencement of use and shall continue in perpetuity
                unless terminated by ClipVora or you in writing. ClipVora reserves the right to change, suspend or discontinue
                the Services at any time. Without prejudice to any other rights, these Terms shall terminate automatically if
                you fail to comply with any restrictions. Upon termination, you must immediately cease any use of the Site
                and Services.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">12</div>
              <div>
                <h2>{t('termsS12Title')}</h2>
                <p className="legal-section-desc">{t('termsS12Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                We reserve the right to modify these Terms of Service at any time without prior notice. Any updated version
                shall supersede and replace the previous version immediately upon the effective date. If you do not agree to
                the modified terms, please discontinue your use of the ClipVora Services.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">13</div>
              <div>
                <h2>{t('termsS13Title')}</h2>
                <p className="legal-section-desc">{t('termsS13Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-contact-box">
                <Mail size={24} />
                <div>
                  <p>If you have any questions or suggestions regarding these Terms of Service, please contact us at:</p>
                  <a href="mailto:sachinv1410@gmail.com" className="legal-email">sachinv1410@gmail.com</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
