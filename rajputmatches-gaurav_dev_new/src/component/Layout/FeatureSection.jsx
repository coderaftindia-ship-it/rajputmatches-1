import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./FeatureSection.css";
import { publicApi } from "../../api";

const DEFAULT_ICONS = [
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><circle cx="12" cy="19" r="1"/></svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
];

const DEFAULT_CMS = {
  featureSectionHeading: "Premium Features",
  feature1Title: "Elite Rajput Profiles",
  feature2Title: "100% Privacy",
  feature3Title: "Personalized Matchmaking",
  feature4Title: "Connect with Trust",
  feature5Title: "Traditional Values",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function FeatureSection() {
  const [cms, setCms] = useState(DEFAULT_CMS);

  useEffect(() => {
    publicApi.getHomeCMS()
      .then((res) => {
        if (res?.data?.data) setCms({ ...DEFAULT_CMS, ...res.data.data });
      })
      .catch(() => {});
  }, []);

  const featureTitles = [
    cms.feature1Title,
    cms.feature2Title,
    cms.feature3Title,
    cms.feature4Title,
    cms.feature5Title,
  ];

  return (
    <section className="bg-white py-2 py-md-5 feature-section">
      <div className="container">
        <div className="text-center pt-1 pt-md-4">
          <h2
            className="display-6 fw-bold mb-2 mb-md-4"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--royal-maroon-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.3rem, 4.5vw, 2.4rem)",
              textShadow: "0 0 18px rgba(212, 175, 55, 0.18)",
            }}
          >
            {cms.featureSectionHeading}
          </h2>
        </div>
        <Features featureTitles={featureTitles} />
      </div>
    </section>
  );
}

export const Features = ({ featureTitles }) => {
  const titles = featureTitles || DEFAULT_ICONS.map((_, i) => DEFAULT_CMS[`feature${i + 1}Title`]);

  const featuresData = titles.map((title, i) => ({
    icon: DEFAULT_ICONS[i],
    title,
  }));

  return (
    <div
      className="d-flex flex-wrap justify-content-center gap-2 gap-md-4 pt-1 pt-md-3 features-flex-container"
      style={{ rowGap: "0.75rem", columnGap: "1rem" }}
    >
      {featuresData.map((feature, index) => (
        <div
          key={index}
          style={{ flex: "1 1 135px", maxWidth: "180px", minWidth: "130px" }}
        >
          <FeatureCard iconClass={feature.icon} title={feature.title} description={feature.description} />
        </div>
      ))}
    </div>
  );
};

export const FeatureCard = ({ iconClass, title, description }) => {
  return (
    <div className="premiumFeatureCard">
      <div className="featureIconCircle">
        {iconClass}
      </div>
      <h3 className="featureTitle">
        {title}
      </h3>
      {description ? (
        <p className="text-secondary" style={{ fontSize: "0.85rem", lineHeight: "1.5", marginTop: "8px", marginBottom: 0 }}>
          {description}
        </p>
      ) : null}
    </div>
  );
};

export const VVIPSection = ({ title, description, buttonText }) => {
  const { isAuthenticated } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-5 pt-4"
    >
      <div
        className="rounded-4 p-5 text-center position-relative overflow-hidden shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--royal-maroon-dark), var(--royal-maroon))",
          border: "2px solid var(--royal-gold)"
        }}
      >
        {/* Subtle background decoration */}
        <div className="position-absolute" style={{ top: "-50%", left: "-20%", width: "100%", height: "200%", background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)", zIndex: 0 }}></div>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold)" }}>{title}</h2>
          <p className="lead mx-auto mb-4" style={{ maxWidth: "800px", color: "var(--royal-cream)", opacity: 0.9 }}>
            {description}
          </p>
          <Link to={isAuthenticated ? "/search" : "/login"}>
            <button className="btn mt-3 px-5 py-3 fs-5" style={{ background: "#ffffff", color: "var(--royal-maroon-dark)", fontWeight: "700", borderRadius: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureSection;
