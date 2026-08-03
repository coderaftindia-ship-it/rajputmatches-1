// About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";

import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";

// Assets
import border from "../../assets/images/Aboutusborder.js.png";
import imageAbout from "../../assets/images/imageAbout.jpg";
import imageAbout2 from "../../assets/images/imageAbout2.jpg";
import royalimg from "../../assets/images/royalimg.jpg";
import royalimg2 from "../../assets/images/royalimg2.jpg";
import HHpratapimage from "../../assets/images/HHpratapimage.png";
import aboutVideo from "../../assets/images/about_video.mp4";

// Lucide Icons for high-end visual appeal
import {
  ShieldCheck,
  Users,
  Globe,
  Lock,
  HeartHandshake,
  Award,
  Eye,
  Target,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
  Crown,
  Clock,
  Shield
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function About() {
  const { isAuthenticated } = useAuth();

  // Why Rajput Alliance Feature Cards Data
  const whyChooseFeatures = [
    {
      icon: ShieldCheck,
      title: "Verified Profiles",
      description: "Every profile goes through a verification process to promote authenticity and trust.",
      badgeColor: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.08)"
    },
    {
      icon: Users,
      title: "Rajput Community Focused",
      description: "A platform built exclusively for Rajput individuals and families.",
      badgeColor: "#800000",
      bgColor: "rgba(128, 0, 0, 0.08)"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with Rajput families across India and around the world.",
      badgeColor: "#2563EB",
      bgColor: "rgba(37, 99, 235, 0.08)"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your personal information is protected with strong privacy controls.",
      badgeColor: "#D97706",
      bgColor: "rgba(217, 119, 6, 0.08)"
    },
    {
      icon: HeartHandshake,
      title: "Meaningful Matches",
      description: "Smart matching based on preferences, values, education, profession, and family background.",
      badgeColor: "#E11D48",
      bgColor: "rgba(225, 29, 72, 0.08)"
    },
    {
      icon: Award,
      title: "Trusted by Families",
      description: "A platform designed with respect for traditions while embracing modern technology.",
      badgeColor: "#7C3AED",
      bgColor: "rgba(124, 58, 237, 0.08)"
    }
  ];

  // Core Value Cards Data
  const coreValues = [
    {
      icon: Shield,
      title: "Trust",
      description: "Every connection begins with authenticity and verified profiles.",
      accent: "#D4AF37"
    },
    {
      icon: Crown,
      title: "Heritage",
      description: "We honor Rajput traditions while supporting modern aspirations.",
      accent: "#800000"
    },
    {
      icon: Heart,
      title: "Respect",
      description: "Every individual and every family deserves dignity, privacy, and respect.",
      accent: "#E11D48"
    },
    {
      icon: Clock,
      title: "Commitment",
      description: "We are committed to helping build relationships that stand the test of time.",
      accent: "#2563EB"
    }
  ];

  return (
    <>
      <div style={{ backgroundColor: "#FDFBF7", minHeight: "100vh" }} className="pb-bottom-nav">
        <Profilenavbar />

        {/* Hero Section */}
        <section
          className="position-relative overflow-hidden d-flex align-items-center justify-content-center"
          style={{
            minHeight: "75vh",
            width: "100%",
            background: "linear-gradient(135deg, #3B0000 0%, #600000 50%, #200000 100%)",
            color: "#ffffff"
          }}
        >
          {/* Dynamic Background Video Layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 0
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.75) contrast(1.1)",
                opacity: 0.9
              }}
            >
              <source src={aboutVideo} type="video/mp4" />
              <source src="/about_video.mp4" type="video/mp4" />
              <source src="/assets/images/about_video.mp4" type="video/mp4" />
            </video>

            {/* Subtle Royal Maroon Tint Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(59, 0, 0, 0.45) 0%, rgba(80, 0, 0, 0.35) 50%, rgba(20, 0, 0, 0.65) 100%)",
                zIndex: 1
              }}
            ></div>
          </div>

          {/* Radial Overlay Glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.18) 0%, transparent 70%)",
              zIndex: 2
            }}
          ></div>

          {/* Hero Text Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center w-100"
            style={{ zIndex: 10, position: "relative", padding: "3rem 1.25rem", maxWidth: "900px" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill mb-3"
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                border: "1.5px solid rgba(212, 175, 55, 0.6)",
                backdropFilter: "blur(6px)",
                color: "#E8C371",
                fontSize: "0.85rem",
                letterSpacing: "2.5px",
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              <Sparkles size={16} color="#E8C371" />
              <span>Connecting Rajputs Worldwide</span>
            </motion.div>

            <h1
              className="display-4 fw-bold mb-3"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                textShadow: "0 4px 20px rgba(0,0,0,0.6)"
              }}
            >
              About <span style={{ color: "#E8C371", textShadow: "0 2px 15px rgba(232, 195, 113, 0.4)" }}>Rajput Alliance</span>
            </h1>

            <p
              className="lead mx-auto mb-4"
              style={{
                maxWidth: "760px",
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                fontWeight: 400,
                textShadow: "0 2px 10px rgba(0,0,0,0.7)"
              }}
            >
              Rajput Alliance is a premier matrimonial network created exclusively for the Rajput community — bringing together individuals and families who value heritage, tradition, trust, and lifelong commitment.
            </p>

            <div className="d-flex align-items-center justify-content-center gap-2 mt-3 opacity-85">
              <div style={{ width: "50px", height: "1px", backgroundColor: "#E8C371" }}></div>
              <Crown size={18} color="#E8C371" />
              <div style={{ width: "50px", height: "1px", backgroundColor: "#E8C371" }}></div>
            </div>
          </motion.div>
        </section>

        {/* Main Content Container */}
        <div className="container py-5" style={{ position: "relative", zIndex: 10 }}>

          {/* Section: The Union of Two Families & Traditions */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mb-5 pb-3"
          >
            <div
              className="bg-white rounded-4 p-4 p-md-5 position-relative overflow-hidden"
              style={{
                border: "2px solid rgba(212, 175, 55, 0.35)",
                boxShadow: "0 15px 45px rgba(128, 0, 0, 0.06)",
                background: "linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%)"
              }}
            >
              {/* Radial Ambient Glow */}
              <div
                className="position-absolute"
                style={{
                  top: "-30%",
                  right: "-10%",
                  width: "60%",
                  height: "160%",
                  background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none"
                }}
              ></div>

              {/* Header */}
              <div className="text-center max-w-800 mx-auto mb-4">
                <span
                  className="text-uppercase fw-bold d-inline-block mb-2 px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: "rgba(128, 0, 0, 0.06)",
                    color: "#800000",
                    fontSize: "0.85rem",
                    letterSpacing: "2.5px"
                  }}
                >
                  ✦ Heritage & Harmony ✦
                </span>
                <h2
                  className="display-5 fw-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#3B0000", lineHeight: 1.25 }}
                >
                  More Than Finding a Partner — <br className="d-none d-md-block" />
                  <span style={{ color: "#800000" }}>It Is the Union of Two Families</span>
                </h2>
                <div style={{ width: "80px", height: "3px", backgroundColor: "#D4AF37", margin: "0 auto" }}></div>
              </div>

              {/* Main Lead Paragraph */}
              <p
                className="text-secondary text-center mx-auto mb-5"
                style={{
                  maxWidth: "850px",
                  fontSize: "1.15rem",
                  lineHeight: 1.85,
                  fontFamily: "var(--font-body)",
                  color: "#4A4A4A"
                }}
              >
                Marriage is more than finding a partner. It is the union of two families, two traditions, and two journeys. At Rajput Alliance, we help make that journey meaningful by connecting verified Rajput profiles from India and across the globe.
              </p>

              {/* 3 Pillar Cards: Two Families, Two Traditions, Two Journeys */}
              <div className="row g-4 mb-4">
                {/* Pillar 1 */}
                <div className="col-12 col-md-4">
                  <div
                    className="p-4 rounded-4 text-center h-100 transition-all"
                    style={{
                      backgroundColor: "#FDF9F2",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(128, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = "#D4AF37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                    }}
                  >
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "56px",
                        height: "56px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #D4AF37",
                        color: "#800000"
                      }}
                    >
                      <Users size={26} />
                    </div>
                    <h4 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#3B0000", fontSize: "1.2rem" }}>
                      Two Families
                    </h4>
                    <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Uniting honorable Rajput lineages built on shared values, heritage, and mutual respect.
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="col-12 col-md-4">
                  <div
                    className="p-4 rounded-4 text-center h-100 transition-all"
                    style={{
                      backgroundColor: "#FDF9F2",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(128, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = "#D4AF37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                    }}
                  >
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "56px",
                        height: "56px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #D4AF37",
                        color: "#800000"
                      }}
                    >
                      <Sparkles size={26} />
                    </div>
                    <h4 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#3B0000", fontSize: "1.2rem" }}>
                      Two Traditions
                    </h4>
                    <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Preserving sacred Rajput customs while embracing modern aspirations for life partners.
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="col-12 col-md-4">
                  <div
                    className="p-4 rounded-4 text-center h-100 transition-all"
                    style={{
                      backgroundColor: "#FDF9F2",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(128, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = "#D4AF37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                    }}
                  >
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "56px",
                        height: "56px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #D4AF37",
                        color: "#800000"
                      }}
                    >
                      <HeartHandshake size={26} />
                    </div>
                    <h4 className="fw-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#3B0000", fontSize: "1.2rem" }}>
                      Two Journeys
                    </h4>
                    <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Connecting verified Rajput profiles across India and globally into a harmonious union.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Ribbon */}
              <div
                className="p-3 p-md-4 rounded-3 text-center"
                style={{
                  backgroundColor: "rgba(80, 0, 0, 0.04)",
                  borderLeft: "4px solid #D4AF37",
                  borderRight: "4px solid #D4AF37"
                }}
              >
                <p className="mb-0 fst-italic fw-medium" style={{ color: "#500000", fontSize: "1.05rem" }}>
                  "Rooted in Rajput pride and customs, we honor family values while giving you modern features to find your ideal match."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Ornamental Divider */}
          <div className="text-center my-5">
            <img
              src={border}
              alt="Decorative Gold Divider"
              style={{ width: "100%", maxWidth: "700px", opacity: 0.75 }}
            />
          </div>

          {/* Section: Why Rajput Alliance? */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="my-5"
          >
            {/* Header */}
            <div className="text-center max-w-750 mx-auto mb-5">
              <span
                className="text-uppercase fw-bold d-inline-block mb-2"
                style={{ color: "#800000", fontSize: "0.85rem", letterSpacing: "2.5px" }}
              >
                ✦ Why Rajput Alliance? ✦
              </span>
              <h2
                className="display-5 fw-bold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "#3B0000" }}
              >
                Built with Trust, Privacy & Integrity
              </h2>
              <p
                className="text-secondary mx-auto"
                style={{ maxWidth: "750px", fontSize: "1.1rem", lineHeight: 1.7 }}
              >
                We believe finding the right life partner should be secure, respectful, and transparent. That's why every step of our platform is designed to help families connect with confidence.
              </p>
            </div>

            {/* Feature Cards Grid (6 Items) */}
            <div className="row g-4">
              {whyChooseFeatures.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div key={index} variants={itemVariants} className="col-12 col-md-6 col-lg-4">
                    <div
                      className="bg-white rounded-4 p-4 h-100 shadow-sm transition-all position-relative overflow-hidden"
                      style={{
                        border: "1px solid rgba(212, 175, 55, 0.22)",
                        transition: "all 0.35s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 15px 35px rgba(128, 0, 0, 0.08)";
                        e.currentTarget.style.borderColor = "#D4AF37";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.22)";
                      }}
                    >
                      {/* Icon Bubble */}
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                        style={{
                          width: "56px",
                          height: "56px",
                          backgroundColor: item.bgColor,
                          color: item.badgeColor
                        }}
                      >
                        <IconComponent size={28} />
                      </div>

                      {/* Card Title */}
                      <h4
                        className="fw-bold mb-2"
                        style={{ fontSize: "1.2rem", color: "#3B0000", fontFamily: "var(--font-heading)" }}
                      >
                        {item.title}
                      </h4>

                      {/* Card Description */}
                      <p className="text-secondary mb-0" style={{ fontSize: "0.98rem", lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Section: Our Vision & Our Mission Dual Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="row g-4 my-5 py-3"
          >
            {/* Our Vision Card */}
            <motion.div variants={itemVariants} className="col-12 col-md-6">
              <div
                className="p-4 p-md-5 rounded-4 h-100 text-white position-relative overflow-hidden shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #500000 0%, #2B0000 100%)",
                  border: "2px solid #D4AF37"
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(212, 175, 55, 0.18)",
                    border: "1px solid #D4AF37",
                    color: "#E8C371"
                  }}
                >
                  <Eye size={30} />
                </div>
                <h3
                  className="display-6 fw-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8C371" }}
                >
                  Our Vision
                </h3>
                <p className="lead mb-0" style={{ color: "rgba(255, 255, 255, 0.92)", lineHeight: 1.75, fontSize: "1.1rem" }}>
                  To become the most trusted Rajput matrimonial platform by creating genuine connections that strengthen families, preserve cultural heritage, and inspire lifelong relationships.
                </p>
              </div>
            </motion.div>

            {/* Our Mission Card */}
            <motion.div variants={itemVariants} className="col-12 col-md-6">
              <div
                className="p-4 p-md-5 rounded-4 h-100 text-white position-relative overflow-hidden shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #2B0000 0%, #500000 100%)",
                  border: "2px solid #D4AF37"
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(212, 175, 55, 0.18)",
                    border: "1px solid #D4AF37",
                    color: "#E8C371"
                  }}
                >
                  <Target size={30} />
                </div>
                <h3
                  className="display-6 fw-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8C371" }}
                >
                  Our Mission
                </h3>
                <p className="lead mb-0" style={{ color: "rgba(255, 255, 255, 0.92)", lineHeight: 1.75, fontSize: "1.1rem" }}>
                  To provide a secure, transparent, and premium matrimonial experience where every Rajput family can confidently find meaningful and compatible matches.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Section: Our Values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="my-5 py-4"
          >
            <div className="text-center mb-5">
              <span
                className="text-uppercase fw-bold d-inline-block mb-2"
                style={{ color: "#800000", fontSize: "0.85rem", letterSpacing: "2.5px" }}
              >
                ✦ Guiding Pillars ✦
              </span>
              <h2 className="display-5 fw-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "#3B0000" }}>
                Our Values
              </h2>
              <div style={{ width: "80px", height: "3px", backgroundColor: "#D4AF37", margin: "0 auto" }}></div>
            </div>

            <div className="row g-4">
              {coreValues.map((val, idx) => {
                const ValIcon = val.icon;
                return (
                  <motion.div key={idx} variants={itemVariants} className="col-12 col-sm-6 col-lg-3">
                    <div
                      className="bg-white rounded-4 p-4 text-center h-100 shadow-sm transition-all"
                      style={{
                        border: "1px solid rgba(212, 175, 55, 0.25)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(128, 0, 0, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor: "#FDF9F2",
                          border: "1.5px solid #D4AF37",
                          color: val.accent
                        }}
                      >
                        <ValIcon size={26} />
                      </div>
                      <h4
                        className="fw-bold mb-2"
                        style={{ fontSize: "1.25rem", color: "#3B0000", fontFamily: "var(--font-heading)" }}
                      >
                        {val.title}
                      </h4>
                      <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Section: CTA Banner - Building Relationships That Last */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="my-5 pt-3"
          >
            <div
              className="rounded-4 p-4 p-md-5 text-center position-relative overflow-hidden shadow-lg"
              style={{
                background: "linear-gradient(135deg, #500000 0%, #3B0000 50%, #1F0000 100%)",
                border: "2px solid #D4AF37"
              }}
            >
              {/* Decorative Glow */}
              <div
                className="position-absolute"
                style={{
                  top: "-40%",
                  left: "-20%",
                  width: "140%",
                  height: "180%",
                  background: "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 65%)",
                  pointerEvents: "none"
                }}
              ></div>

              <div className="position-relative" style={{ zIndex: 1, maxWidth: "880px", margin: "0 auto" }}>
                <span
                  className="text-uppercase fw-bold d-inline-block mb-3 px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#E8C371",
                    fontSize: "0.82rem",
                    letterSpacing: "2px"
                  }}
                >
                  ✦ Begin Your Journey ✦
                </span>

                <h2
                  className="display-5 fw-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8C371" }}
                >
                  Building Relationships That Last
                </h2>

                <p
                  className="lead mx-auto mb-3"
                  style={{ color: "rgba(255, 255, 255, 0.95)", fontSize: "1.15rem", lineHeight: 1.7 }}
                >
                  Whether you are beginning your search or helping a loved one find the right partner, Rajput Alliance is here to support every step of the journey.
                </p>

                <p
                  className="fw-semibold mb-4"
                  style={{ color: "#E8C371", fontSize: "1.05rem", fontStyle: "italic" }}
                >
                  Join a community where tradition meets trust, families come together, and lifelong relationships begin.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                  <Link to={isAuthenticated ? "/search" : "/login"}>
                    <button
                      className="btn px-4 py-3 fs-5 fw-bold d-inline-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #E8C371 0%, #D4AF37 100%)",
                        color: "#3B0000",
                        borderRadius: "30px",
                        border: "none",
                        boxShadow: "0 8px 25px rgba(212, 175, 55, 0.35)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.04)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(212, 175, 55, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(212, 175, 55, 0.35)";
                      }}
                    >
                      <span>{isAuthenticated ? "Find Matches Now" : "Register / Find Matches"}</span>
                      <ArrowRight size={20} />
                    </button>
                  </Link>

                  <Link to="/contact">
                    <button
                      className="btn px-4 py-3 fs-5 fw-bold text-white d-inline-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "transparent",
                        borderRadius: "30px",
                        border: "1.5px solid rgba(212, 175, 55, 0.6)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span>Contact Us</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  );
}

// Export sub-components for backward compatibility if imported anywhere
export const WhyChooseSection = ({ imageSrc, heading, features }) => {
  return null;
};

export const LegacySection = ({ leftImage, rightImage, title, paragraphs }) => {
  return null;
};

export default About;

