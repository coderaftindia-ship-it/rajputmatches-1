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

import { publicApi } from "../../api/public.api";

function Footer() {
  const { logout } = useAuth();
  const { siteSettings } = useSiteSettings();
  const [links, setLinks] = useState({});

  useEffect(() => {
    publicApi.getSocialLinks()
      .then((res) => {
        const data = res?.data || res;
        if (data?.links) {
          setLinks(data.links);
        }
      })
      .catch(() => {});
  }, []);

  const socialConfig = [
    { icon: <FaFacebook size={14} color="var(--royal-gold)" />, label: "Facebook", key: "facebook" },
    { icon: <FaInstagram size={14} color="var(--royal-gold)" />, label: "Instagram", key: "instagram" },
    { icon: <FaWhatsapp size={14} color="var(--royal-gold)" />, label: "WhatsApp", key: "whatsapp" },
    { icon: <FaLinkedin size={14} color="var(--royal-gold)" />, label: "LinkedIn", key: "linkedin" },
  ];

  const getSocialUrl = (linksObj, key) => {
    if (!linksObj) return null;
    const val =
      linksObj[key] ??
      linksObj[`${key}Url`] ??
      linksObj[`${key}_url`] ??
      linksObj[`${key}Channel`];
    if (val === undefined || val === null) return null;
    const str = String(val).trim();
    if (str === "") return null;
    return str;
  };

  const activeSocials = socialConfig
    .map((s) => {
      const href = getSocialUrl(links, s.key);
      return href ? { ...s, href } : null;
    })
    .filter(Boolean);

  return (
    <footer className="pb-bottom-nav" style={{ backgroundColor: "var(--royal-maroon-dark, #59123B)", color: "var(--royal-cream, #fdf6ec)", padding: "28px 0 16px" }}>
      <div className="container">
        <div className="row g-3">
          {/* About Section */}
          <div className="col-12 col-lg-6">
            <Link to="/" className="d-inline-flex align-items-center gap-2.5 mb-2 text-decoration-none">
              <img
                src={Logo}
                alt={siteSettings.companyName || "Logo"}
                width="44"
                height="44"
                loading="lazy"
                decoding="async"
                onError={(e) => { e.target.onerror = null; e.target.src = Logo; }}
                style={{
                  height: "44px",
                  width: "44px",
                  maxHeight: "44px",
                  objectFit: "contain",
                  filter: "drop-shadow(0px 2px 8px rgba(237, 177, 57, 0.4))",
                }}
              />
              <div className="d-flex flex-column text-start">
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.15rem",
                  fontWeight: "800",
                  color: "var(--royal-gold, #EDB139)",
                  letterSpacing: "1px",
                  lineHeight: "1.1",
                  textTransform: "uppercase"
                }}>
                  {siteSettings.companyName || "Rajput Alliances"}
                </span>
                <span style={{
                  fontSize: "0.62rem",
                  color: "var(--royal-gold-light, #F5C870)",
                  letterSpacing: "2px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginTop: "1px"
                }}>
                  {siteSettings.tagline || "Royal Matrimonial"}
                </span>
              </div>
            </Link>

            <p className="mb-2.5" style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.82rem", lineHeight: "1.45", maxWidth: "520px" }}>
             Global matrimonial platform created to help Rajput families connect, discover meaningful relationships, and find compatible life partners while honoring the traditions, values, and heritage that unite the Rajput community.
            </p>

            <div className="d-flex gap-2 flex-wrap mb-2">
              {activeSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px", borderColor: "rgba(255,255,255,0.25)", padding: 0 }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-3">
            <h6 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold, #EDB139)", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
              Quick Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-1.5 mb-0" style={{ fontSize: "0.82rem" }}>
              <li>
                <Link to="/about" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>About Us</Link>
              </li>
              <li>
                <Link to="/stories" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>Stories</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>Login</Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="col-6 col-lg-3">
            <h6 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold, #EDB139)", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
              Legal
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-1.5 mb-0" style={{ fontSize: "0.82rem" }}>
              <li>
                <Link to="/terms-of-use" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>Terms of Use</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-decoration-none" style={{ color: "rgba(255, 255, 255, 0.75)" }}>Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-2.5" style={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <div className="text-center">
          <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.78rem" }}>
            {siteSettings.copyrightText || "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
