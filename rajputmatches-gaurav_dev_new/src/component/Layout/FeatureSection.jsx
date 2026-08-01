import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LiaCrownSolid, LiaChessKingSolid } from "react-icons/lia";
import { IoShieldOutline, IoAccessibilityOutline } from "react-icons/io5";
import { useAuth } from "./AuthContext";
import "./FeatureSection.css";
import { publicApi } from "../../api";

const DEFAULT_ICONS = [
  <LiaCrownSolid />,
  <IoShieldOutline />,
  <IoAccessibilityOutline />,
  <LiaChessKingSolid />,
  <LiaChessKingSolid />,
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
    <section className="bg-white pb-5">
      <div className="container">
        <div className="text-center pt-0">
          <h2
            className="display-6 fw-bold mb-2"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--royal-maroon-dark)",
              fontFamily: "var(--font-heading)",
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
      className="d-flex flex-wrap justify-content-center gap-4 pt-3"
      style={{ rowGap: "1.25rem", columnGap: "1.75rem" }}
    >
      {featuresData.map((feature, index) => (
        <div
          key={index}
          style={{ flex: "1 1 170px", maxWidth: "190px", minWidth: "160px" }}
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
