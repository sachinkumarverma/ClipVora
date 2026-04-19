import { useEffect } from 'react';
import { Shield, Mail, Cookie, Eye, Lock, UserCheck, Bell, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n';

export default function PrivacyPolicy() {
  const { t } = useI18n();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      {/* Hero */}
      <div className="legal-hero">
        <div className="container">
          <div className="legal-hero-icon">
            <Shield size={32} />
          </div>
          <h1>{t('privacyTitle')}</h1>
          <p className="legal-hero-sub">{t('privacyHeroDesc')}</p>
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
              This Privacy Policy explains how we collect, use and share your personal information while you use ClipVora.
              By using ClipVora you agree to the collection and use of your personal information in accordance with this
              Privacy Policy. This Privacy Policy forms part of our Terms of Service. We will review and may update this
              Privacy Policy from time to time. Any changes to this Privacy Policy will become effective when we post the
              revised Privacy Policy on this page.
            </p>
          </div>

          {/* Section 1 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">1</div>
              <div>
                <h2>{t('privacyS1Title')}</h2>
                <p className="legal-section-desc">{t('privacyS1Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-item">
                <div className="legal-item-marker"><Eye size={16} /></div>
                <div>
                  <h4>{t('privacyS1_1')}</h4>
                  <p>
                    We may collect information regarding the use of our Website, especially with respect to your browsing
                    (pages visited, links clicked, etc.). Some of this information may be collected using cookies placed in
                    your web browser. The information that we request is and will be retained by us and used as described in
                    this Privacy Policy. We do not request or intend to collect any "special categories of information" such
                    as any information on health, race, religion, political opinions or philosophical beliefs, sexual
                    preferences or orientation.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><Lock size={16} /></div>
                <div>
                  <h4>{t('privacyS1_2')}</h4>
                  <p>
                    When you request a page from our Website, our servers log the information provided in the HTTP request
                    header, JavaScript or similar technical tools, including the IP number, the time of the request, the URL
                    of your request and other information. We collect this information in order to make our Website function
                    correctly and provide you the functionality that you see on the Website. We also use this information to
                    better understand how visitors use our Website and how we can improve it. This information is not
                    associated with any personally identifiable information.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><Eye size={16} /></div>
                <div>
                  <h4>{t('privacyS1_3')}</h4>
                  <p>
                    When you use the Website, ClipVora or trusted third parties authorized by ClipVora may also collect
                    certain technical and routing information about your computer (also known as environmental variables) to
                    facilitate your use of the Website and the Services enabled thereby. Examples of such information include
                    the URL of the particular Web page you visited, the IP address of the computer you are using, or the
                    browser version that you are using to access the Website.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><Cookie size={16} /></div>
                <div>
                  <h4>{t('privacyS1_4')}</h4>
                  <p>
                    We use cookies and other similar technologies to help provide our Services, to advertise to you and to
                    analyse how you use our Services and whether advertisements are being viewed. By continuing to use and
                    navigate our sites, services, tools or messaging, you are agreeing to our use of cookies as described in
                    this Privacy Policy.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('privacyS1_5')}</h4>
                  <p>
                    Our Website may contain links to other third-party websites. ClipVora is not responsible for the privacy
                    practices or the content of such websites. We encourage you to carefully read the privacy statement of
                    any website you visit. Information collected by third party application providers is governed by the
                    provider's privacy policies.
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
                <h2>{t('privacyS2Title')}</h2>
                <p className="legal-section-desc">{t('privacyS2Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p className="legal-body-intro">The primary purposes for collecting and using your personal information include:</p>
              <div className="legal-purpose-grid">
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose1')}</h4>
                  <p>Developing, delivering and improving our Service, providing updates, technical troubleshooting, understanding and analyzing trends in connection with usage of the Services.</p>
                </div>
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose2')}</h4>
                  <p>We may use your information for displaying third-party advertisements to make our Services available for free.</p>
                </div>
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose3')}</h4>
                  <p>Understanding about the usage of the Services. We may also create reports and analysis for the purposes of research.</p>
                </div>
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose4')}</h4>
                  <p>Enhancing the safety and security of our Services.</p>
                </div>
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose5')}</h4>
                  <p>Providing customer support to you and to respond to your inquiries.</p>
                </div>
                <div className="legal-purpose-card">
                  <h4>{t('privacyPurpose6')}</h4>
                  <p>To comply with applicable legal or regulatory obligations, including as part of a judicial proceeding or law enforcement request.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">3</div>
              <div>
                <h2>{t('privacyS3Title')}</h2>
                <p className="legal-section-desc">{t('privacyS3Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-item">
                <div className="legal-item-marker"><Cookie size={16} /></div>
                <div>
                  <h4>{t('privacyS3_1')}</h4>
                  <p>
                    We use cookies and similar technologies like web beacons, pixel tags, or local shared objects ("flash cookies"),
                    to deliver, measure, and improve the Service in various ways. A cookie is a small text file that identifies your
                    computer on our server. Cookies in themselves do not identify the individual user, only the computer being used.
                    Cookies are not used to gather personal information.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><UserCheck size={16} /></div>
                <div>
                  <h4>{t('privacyS3_2')}</h4>
                  <p>
                    You may, at any time, configure your computer to accept all cookies, to notify you when a cookie is issued, and
                    to reject the reception of any cookies. We encourage you to look at your browser settings to find out how you can
                    make choices regarding cookies. You may choose to decline all cookies, but if you do, you may be limited to
                    certain areas of the Service.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('privacyS3_3')}</h4>
                  <p>
                    We also work with analytics partners who use cookies and similar technologies to help us analyze how users use
                    the Service. Third Party Cookies, which include the use of cookies by our partners, affiliates and service
                    providers, are not covered by our privacy statement. We do not have access to or control over these cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">4</div>
              <div>
                <h2>{t('privacyS4Title')}</h2>
                <p className="legal-section-desc">{t('privacyS4Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p className="legal-body-intro">
                By using our services, you consent to our collection and storage of the aforementioned personal information.
                We will manage and protect your data according to strict security and confidentiality standards. Your data
                will not be disclosed to any third party except under the following circumstances:
              </p>
              <ul className="legal-list">
                <li><strong>Affiliates & Service Providers:</strong> We may share your personal data with our affiliates which may access your personal data to help us develop, maintain and provide our Service.</li>
                <li><strong>Business Partners:</strong> We may share certain information such as your location, browser and cookie data with our business partners to deliver personalized advertisements.</li>
                <li><strong>Non-Personal Data:</strong> We may share non-personal data with interested third parties to help them understand usage patterns or conduct independent research.</li>
                <li><strong>Legal Purposes:</strong> We may access, preserve and disclose information to investigate, prevent, or take action in connection with legal process and legal requests.</li>
                <li><strong>New Ownership:</strong> If the ownership of ClipVora changes as a result of a merger, acquisition or sale of assets, we may transfer your information to the new owner.</li>
              </ul>
              <p>
                ClipVora operates secure data networks protected by industry standard firewall and password protection systems.
                Only authorized individuals have access to the information provided by our users. When you submit personal
                information to ClipVora, you understand and agree that this information may be transferred across national
                boundaries. All data transfers are subject to appropriate guarantees that comply with applicable regulations
                relating to the protection of personal data.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">5</div>
              <div>
                <h2>{t('privacyS5Title')}</h2>
                <p className="legal-section-desc">{t('privacyS5Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                Ads appearing on our site may be delivered to Users by advertising partners, who may set cookies. These cookies
                allow the ad server to recognize your computer each time they send you an online advertisement to compile non
                personal identification information about you or others who use your computer. This information allows ad
                networks to deliver targeted advertisements that they believe will be of most interest to you. This privacy
                policy does not cover the use of cookies by any advertisers.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">6</div>
              <div>
                <h2>{t('privacyS6Title')}</h2>
                <p className="legal-section-desc">{t('privacyS6Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                At ClipVora, the security of your information is our top priority. We have implemented numerous stringent
                measures to protect our data against unauthorized access, disclosure, or destruction. Your data is stored only
                in facilities that meet the highest standards of security. Professional security personnel strictly monitor
                physical access to our facilities using video surveillance and other electronic measures.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">7</div>
              <div>
                <h2>{t('privacyS7Title')}</h2>
                <p className="legal-section-desc">{t('privacyS7Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                ClipVora Website and any Services available on that site are not directed at children under 18 years or other
                permitted by the applicable law age. However, we recognize that children under the permitted age may access this
                Website. Parents and Legal Guardians may request from us to review, delete or stop the collection of the
                personally identifiable information of their child. You may do so by contacting us by email at
                <strong> sachinv1410@gmail.com</strong>.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">8</div>
              <div>
                <h2>{t('privacyS8Title')}</h2>
                <p className="legal-section-desc">{t('privacyS8Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('privacyS8_1')}</h4>
                  <p>
                    We will retain your information for as long as necessary to provide our services to you, in accordance with
                    applicable law. Once your information is no longer needed for service provision, we will retain it only for
                    legitimate business purposes. In certain circumstances, we may be required to retain your data for a longer
                    period to comply with legal obligations.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('privacyS8_2')}</h4>
                  <p>
                    In cases where we need to retain your personal data after you terminate our services, such information will
                    be stored in an aggregated and anonymized format.
                  </p>
                </div>
              </div>
              <div className="legal-item">
                <div className="legal-item-marker"><ChevronRight size={16} /></div>
                <div>
                  <h4>{t('privacyS8_3')}</h4>
                  <p>
                    This Privacy Policy is intended to help you understand our general practices. While we use commercially
                    reasonable methods to protect your privacy, we cannot guarantee that your information or communications will
                    always remain confidential or secure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">9</div>
              <div>
                <h2>{t('privacyS9Title')}</h2>
                <p className="legal-section-desc">{t('privacyS9Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p className="legal-body-intro">
                According to data protection and privacy laws, you may have the following rights:
              </p>
              <div className="legal-rights-grid">
                <div className="legal-right-card">
                  <div className="legal-right-icon"><Eye size={20} /></div>
                  <h4>{t('privacyRight1')}</h4>
                  <p>{t('privacyRight1Desc')}</p>
                </div>
                <div className="legal-right-card">
                  <div className="legal-right-icon"><UserCheck size={20} /></div>
                  <h4>{t('privacyRight2')}</h4>
                  <p>{t('privacyRight2Desc')}</p>
                </div>
                <div className="legal-right-card">
                  <div className="legal-right-icon"><Bell size={20} /></div>
                  <h4>{t('privacyRight3')}</h4>
                  <p>{t('privacyRight3Desc')}</p>
                </div>
                <div className="legal-right-card">
                  <div className="legal-right-icon"><Shield size={20} /></div>
                  <h4>{t('privacyRight4')}</h4>
                  <p>{t('privacyRight4Desc')}</p>
                </div>
              </div>
              <p>
                You may contact us by emailing <strong>sachinv1410@gmail.com</strong>. We will respond to your request as
                soon as possible. To protect your privacy, you will be required to provide proof of identity.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">10</div>
              <div>
                <h2>{t('privacyS10Title')}</h2>
                <p className="legal-section-desc">{t('privacyS10Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <p>
                ClipVora periodically makes changes to the privacy policy. The terms of this Privacy Policy may change from
                time to time without prior notice to you. Personal data collected by us will be dealt with in accordance with
                the provisions of our Privacy Policy which were in effect at the time of collection. Your continued use of our
                Services following the posting of any changes means you accept such changes.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">11</div>
              <div>
                <h2>{t('privacyS11Title')}</h2>
                <p className="legal-section-desc">{t('privacyS11Desc')}</p>
              </div>
            </div>
            <div className="legal-section-body">
              <div className="legal-contact-box">
                <Mail size={24} />
                <div>
                  <p>If you have any questions or suggestions regarding this Privacy Policy, please contact us at:</p>
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
