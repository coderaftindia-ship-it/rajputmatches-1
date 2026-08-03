import React from "react";
import { Link } from "react-router-dom";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { FaShieldAlt, FaUserShield, FaInfoCircle, FaFileContract, FaEnvelope, FaCrown, FaStar } from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <>
      <Profilenavbar />
      <div 
        className="pb-bottom-nav pt-5" 
        style={{ 
          backgroundColor: "var(--royal-cream)", 
          minHeight: "100vh",
          fontFamily: "var(--font-body)"
        }}
      >
        <div className="container py-5">
          {/* Header Banner */}
          <div className="text-center mb-5">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid var(--royal-gold)",
                background: "linear-gradient(135deg, var(--royal-maroon-dark), var(--royal-maroon))",
                boxShadow: "0 8px 24px rgba(128, 0, 0, 0.15)"
              }}
            >
              <FaShieldAlt size={36} color="var(--royal-gold)" />
            </div>
            <h1 
              className="section-title-gold fw-bold mb-3" 
              style={{ 
                fontFamily: "var(--font-heading)", 
                color: "var(--royal-maroon)",
                fontSize: "2.8rem"
              }}
            >
              Privacy Policy
            </h1>
            <p 
              className="mx-auto" 
              style={{ 
                maxWidth: "750px", 
                color: "var(--royal-text-light)",
                fontSize: "1.1rem",
                lineHeight: "1.8"
              }}
            >
              At Rajput Alliances.com, we value your privacy and are committed to protecting your personal information. 
              This Privacy Policy outlines how we collect, use, share, and protect your information when you use our website and services.
            </p>
          </div>

          {/* Main Content Layout */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-10">
              <div 
                className="glass-panel p-4 p-md-5 rounded-4 shadow-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(212, 175, 55, 0.3)"
                }}
              >
                {/* 1. Information We Collect */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    1. Information We Collect
                  </h3>
                  <p className="mb-4" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We collect the following types of information to provide and improve our services:
                  </p>
                  
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="p-3 h-100 rounded-3" style={{ background: "rgba(237, 177, 57, 0.08)", border: "1px solid rgba(237, 177, 57, 0.2)" }}>
                        <h5 className="fw-bold mb-2" style={{ color: "var(--royal-maroon)" }}>Personal Information</h5>
                        <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>
                          Name, email address, phone number, date of birth, gender, location, and other details necessary for creating your profile. 
                          We may also collect information about your preferences and interests to better match you with potential partners.
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                      <div className="p-3 h-100 rounded-3" style={{ background: "rgba(237, 177, 57, 0.08)", border: "1px solid rgba(237, 177, 57, 0.2)" }}>
                        <h5 className="fw-bold mb-2" style={{ color: "var(--royal-maroon)" }}>Profile Information</h5>
                        <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>
                          Photographs, religious and cultural preferences, educational background, professional details, and other information you choose to share.
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="p-3 h-100 rounded-3" style={{ background: "rgba(237, 177, 57, 0.08)", border: "1px solid rgba(237, 177, 57, 0.2)" }}>
                        <h5 className="fw-bold mb-2" style={{ color: "var(--royal-maroon)" }}>Usage Data</h5>
                        <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>
                          IP address, device type, browser type, pages visited, time and date of visits, and activity logs related to interactions on our platform.
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="p-3 h-100 rounded-3" style={{ background: "rgba(237, 177, 57, 0.08)", border: "1px solid rgba(237, 177, 57, 0.2)" }}>
                        <h5 className="fw-bold mb-2" style={{ color: "var(--royal-maroon)" }}>Communication Data</h5>
                        <p className="mb-0 small" style={{ color: "var(--royal-text)", lineHeight: "1.6" }}>
                          Messages, chats, and interactions with other members on Rajput Alliances.com.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-3" style={{ borderLeft: "4px solid var(--royal-gold)", background: "rgba(252, 245, 234, 0.5)" }}>
                    <h5 className="fw-bold mb-1" style={{ color: "var(--royal-maroon)" }}>Cookies</h5>
                    <p className="mb-0" style={{ color: "var(--royal-text)", lineHeight: "1.7" }}>
                      We use cookies to enhance your experience on Rajput Alliances.com. You can disable cookies in your browser settings, 
                      but this may affect your ability to use certain features of our website.
                    </p>
                  </div>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 2. How We Use Your Information */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    2. How We Use Your Information
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We use your information for the following purposes:
                  </p>
                  <ul className="list-unstyled d-flex flex-column gap-2 ps-2">
                    {[
                      "To create and manage your account.",
                      "To match you with compatible members.",
                      "To facilitate communication between users.",
                      "To enhance and personalize your experience on our platform.",
                      "To analyze user behavior and preferences to improve our services.",
                      "To monitor and ensure security and prevent fraudulent activities.",
                      "To comply with legal obligations and enforce our Terms of Use.",
                      "To send service-related notifications, promotions, or updates."
                    ].map((item, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-3 mb-2">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1"
                          style={{
                            width: "22px",
                            height: "22px",
                            backgroundColor: "rgba(128, 0, 0, 0.08)",
                            border: "1px solid #D4AF37",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                          }}
                        >
                          <FaStar size={10} color="#D4AF37" />
                        </div>
                        <span style={{ color: "var(--royal-text)", lineHeight: "1.75", fontSize: "0.98rem" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 3. Sharing Your Information */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4 d-flex align-items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    3. Sharing Your Information
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We respect your privacy and only share your information under the following circumstances:
                  </p>
                  <ul className="list-unstyled d-flex flex-column gap-2 ps-2 mb-4">
                    {[
                      "With other registered users as per your privacy settings.",
                      "With trusted third-party service providers who assist in operating our platform and providing our services. These providers are contractually obligated to protect your data.",
                      "We may share your profile (without direct contact details) to promote your profile on our social media platforms as well as directly with other matching members.",
                      "When required by law, legal processes, or to protect our rights and the rights of others.",
                      "In case of business transfers, mergers, or acquisitions."
                    ].map((item, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-3 mb-2">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 mt-1"
                          style={{
                            width: "22px",
                            height: "22px",
                            backgroundColor: "rgba(128, 0, 0, 0.08)",
                            border: "1px solid #D4AF37",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                          }}
                        >
                          <FaStar size={10} color="#D4AF37" />
                        </div>
                        <span style={{ color: "var(--royal-text)", lineHeight: "1.75", fontSize: "0.98rem" }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 text-center rounded-3 fw-bold" style={{ backgroundColor: "rgba(128, 0, 0, 0.05)", border: "1px dashed var(--royal-maroon)", color: "var(--royal-maroon)" }}>
                    We do not sell your personal data to third parties.
                  </div>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 4. Your Privacy Choices and Rights */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-4"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    4. Your Privacy Choices and Rights
                  </h3>
                  <p className="mb-3" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    You have the following rights regarding your personal information:
                  </p>
                  <div className="row g-3">
                    {[
                      { title: "Access & Update", desc: "You can review and edit your profile information at any time." },
                      { title: "Privacy Settings", desc: "You can control who sees your profile and details." },
                      { title: "Data Deletion", desc: "You may request the deletion of your account and personal information by contacting our customer support team. Certain data may be retained as required by law." },
                      { title: "Opt-Out", desc: "You can unsubscribe from promotional emails or notifications." }
                    ].map((right, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div className="p-3 h-100 rounded-3 bg-light border border-light">
                          <h6 className="fw-bold mb-2" style={{ color: "var(--royal-maroon)" }}>{right.title}</h6>
                          <p className="mb-0 small" style={{ color: "var(--royal-text-light)", lineHeight: "1.6" }}>{right.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 5. Children's Privacy */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    5. Children's Privacy
                  </h3>
                  <p className="mb-0" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    Rajput Alliances.com is intended for users above the age of 18. We do not knowingly collect data from children under 18. 
                    If we discover such data, we will take immediate action to delete it.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 6. Jurisdiction */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    6. Jurisdiction
                  </h3>
                  <p className="mb-0" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    If there is any dispute about or involving the Site and/or the Service, by using the Site, you unconditionally agree 
                    that all such disputes and/or differences will be governed by the laws of India and shall be subject to the exclusive 
                    jurisdiction of the Competent Courts in Udaipur, India only.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* 7. Changes to This Privacy Policy */}
                <section className="mb-5">
                  <h3 
                    className="fw-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}
                  >
                    7. Changes to This Privacy Policy
                  </h3>
                  <p className="mb-0" style={{ color: "var(--royal-text)", lineHeight: "1.8" }}>
                    We may update this policy from time to time to reflect changes in our practices or legal requirements. 
                    Any significant changes will be communicated through our website or via email.
                  </p>
                </section>

                <hr className="my-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                {/* Contact Card */}
                <div 
                  className="p-4 text-center rounded-4"
                  style={{
                    background: "linear-gradient(135deg, var(--royal-maroon-dark) 0%, var(--royal-maroon) 100%)",
                    border: "2px solid var(--royal-gold)",
                    color: "var(--royal-cream)",
                    boxShadow: "0 10px 25px rgba(128,0,0,0.15)"
                  }}
                >
                  <div className="d-inline-block p-2 mb-3 bg-white bg-opacity-10 rounded-circle">
                    <FaEnvelope size={24} color="var(--royal-gold)" />
                  </div>
                  <h4 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold-light)" }}>Contact Us</h4>
                  <p className="mb-3 small" style={{ color: "rgba(255,255,255,0.85)" }}>
                    If you have any questions or concerns regarding this Privacy Policy, please contact us at:
                  </p>
                  <h5 className="fw-bold mb-0">
                    <a href="mailto:info@Rajput Alliances.com" style={{ color: "var(--royal-gold-light)", textDecoration: "none" }}>
                      info@Rajput Alliances.com
                    </a>
                  </h5>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
