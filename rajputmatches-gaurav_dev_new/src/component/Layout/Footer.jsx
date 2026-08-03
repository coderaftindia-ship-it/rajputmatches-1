// Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import { useAuth } from "./AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const BASE_URL = (process.env.REACT_APP_BASE_URL || process.env.VITE_APP_BASE_URL || "http://localhost:5000/").replace(/\/$/, "");

function Footer() {
  const { logout } = useAuth();
  const { siteSettings } = useSiteSettings();
  const [links, setLinks] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/auth/social-links`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.links) {
          setLinks(data.links);
        }
      })
      .catch(() => {});
  }, []);

  const socialConfig = [
    { icon: <FaFacebook size={18} color="var(--royal-gold)" />, label: "Facebook", key: "facebook" },
    { icon: <FaInstagram size={18} color="var(--royal-gold)" />, label: "Instagram", key: "instagram" },
    { icon: <FaWhatsapp size={18} color="var(--royal-gold)" />, label: "WhatsApp", key: "whatsapp" },
    { icon: <FaTelegram size={18} color="var(--royal-gold)" />, label: "Telegram", key: "telegram" },
    { icon: <FaYoutube size={18} color="var(--royal-gold)" />, label: "YouTube", key: "youtube" },
    { icon: <FaTwitter size={18} color="var(--royal-gold)" />, label: "Twitter", key: "twitter" },
    { icon: <FaLinkedin size={18} color="var(--royal-gold)" />, label: "LinkedIn", key: "linkedin" },
  ];

  const activeSocials = socialConfig.filter((s) => links[s.key] && links[s.key] !== "");

  return (
    <footer className="pb-bottom-nav pt-5" style={{ backgroundColor: "var(--royal-maroon-dark)", color: "var(--royal-cream)" }}>
      <div className="container py-5">
        <div className="row g-5">
          {/* About Section */}
          <div className="col-12 col-lg-5">
            <Link to="/" className="d-inline-flex align-items-center gap-3 mb-4 text-decoration-none">
              <img
                src={siteSettings.logo || Logo}
                alt={siteSettings.companyName || "Logo"}
                onError={(e) => { e.target.onerror = null; e.target.src = Logo; }}
                style={{
                  height: "72px",
                  width: "auto",
                  maxHeight: "72px",
                  objectFit: "contain",
                  filter: "drop-shadow(0px 2px 12px rgba(237, 177, 57, 0.5))",
                  transition: "transform 0.3s ease"
                }}
              />
              <div className="d-flex flex-column text-start">
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.45rem",
                  fontWeight: "800",
                  color: "var(--royal-gold, #EDB139)",
                  letterSpacing: "1.5px",
                  lineHeight: "1.1",
                  textTransform: "uppercase"
                }}>
                  {siteSettings.companyName || "Rajput Alliances"}
                </span>
                <span style={{
                  fontSize: "0.7rem",
                  color: "var(--royal-gold-light, #F5C870)",
                  letterSpacing: "3px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginTop: "2px"
                }}>
                  {siteSettings.tagline || "Royal Matrimonial"}
                </span>
              </div>
            </Link>
            <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8" }}>
              Rajput Alliances is your gateway to a premier, privacy-focused
              matrimonial network for Rajputs seeking serious and secure
              connections. With an exclusive selection of elite profiles, we
              offer a tailored experience for those who value heritage,
              tradition, and privacy.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              {activeSocials.map((s) => (
                <a
                  key={s.label}
                  href={links[s.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", borderColor: "rgba(255,255,255,0.2)" }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="col-12 col-lg-1"></div>

          {/* Quick Links */}
          <div className="col-6 col-lg-3">
            <h5 className="fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold)", letterSpacing: "1px" }}>Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li>
                <Link to="/about" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>About Us</Link>
              </li>
              <li>
                <Link to="/stories" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Stories</Link>
              </li>
              {/* <li>
                <Link to="/how-to-use" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>How to Use</Link>
              </li> */}
              <li>
                <Link to="/contact-us" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Login</Link>
              </li>
              {/* <li>
                <Link to="/signup" onClick={logout} className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Signup</Link>
              </li> */}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="col-6 col-lg-3">
            <h5 className="fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold)", letterSpacing: "1px" }}>Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li>
                <Link to="/terms-of-use" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Terms of Use</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-decoration-none transition-all" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-5" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        
        <div className="text-center pb-3">
          <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem" }}>
            {siteSettings.copyrightText || "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
