// About.jsx
import React, { useState, useEffect } from "react";
import style from "../Profile/ProfileComp/Profile.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { publicApi } from "../../api";
import { BASE_URL, extractData } from "../../api/client";

import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import border from "../../assets/images/Aboutusborder.js.png";
import imgSrcDefault from "../../assets/images/sectionImg (2).png";
import { AiOutlineRight } from "react-icons/ai";
import { Features } from "./FeatureSection";

import imageAbout from "../../assets/images/imageAbout.jpg";
import imageAbout2 from "../../assets/images/imageAbout2.jpg";
import HHpratapimage from "../../assets/images/HHpratapimage.png";
import royalimg from "../../assets/images/royalimg.jpg";
import royalimg2 from "../../assets/images/royalimg2.jpg";

// Stagger and fade animations for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const imageLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const imageRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function About() {
  const { isAuthenticated } = useAuth();
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await publicApi.getAbout();
        const data = extractData(response);
        if (data) {
          setAboutData(data);
        }
      } catch (err) {
        console.error("Error fetching dynamic About content:", err);
      }
    };
    fetchAboutContent();
  }, []);

  const resolveImage = (imagePath, fallback) => {
    if (!imagePath) return fallback;
    if (typeof imagePath !== "string") return fallback;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${BASE_URL}${formattedPath}`;
  };

  const storyData = [
    {
      text: aboutData?.card1Text || "Welcome to Rajput Alliances, the premier matrimonial platform designed exclusively for the Rajput community. Our mission is to bring together Rajput families from across the globe and help them build meaningful connections rooted in shared values, traditions, and cultural heritage.",
      imageSrc: resolveImage(aboutData?.card1Image, imageAbout),
    },
    {
      text: aboutData?.card2Text || "At Rajput Alliances, we understand the importance of preserving Rajput pride and customs, which is why we’ve created a trusted platform tailored specifically to your community's unique needs.",
      imageSrc: resolveImage(aboutData?.card2Image, imageAbout2),
    },
  ];

  const vvipData = {
    title: aboutData?.vvipTitle || "Start Your Journey to a Royal Match Today",
    description: aboutData?.vvipDescription || "Join Rajput Alliances and embark on a journey to find your perfect partner within a community that respects your legacy and honors your privacy. Let us guide you in finding a partner who complements your values, lifestyle, and heritage.",
    buttonText: aboutData?.vvipButtonText || "Join the Rajput Legacy",
  };

  const leftImage = resolveImage(aboutData?.legacyLeftImage, HHpratapimage);
  const rightImage = resolveImage(aboutData?.legacyRightImage, royalimg);
  const title = aboutData?.legacyTitle || "Our Legacy of Trust and Tradition";
  const paragraphs = [
    aboutData?.legacyParagraph1 || "The Rajput community has a long-standing legacy of honor, pride, and cultural richness. At Rajput Alliances, we aim to reflect these values by fostering a trustworthy environment where families can come together to find the perfect match.",
    aboutData?.legacyParagraph2 || "We believe that marriage is not just a union of two individuals but a bond between two families. With this philosophy, we ensure that every match we facilitate is built on shared respect and understanding.",
  ];

  const imageSrc = resolveImage(aboutData?.whyChooseImage, royalimg2);
  const heading = aboutData?.whyChooseHeading || "Why Choose Rajput Alliances?";

  const features = aboutData?.whyChooseFeatures?.length > 0
    ? aboutData.whyChooseFeatures
    : [
        {
          title: "Exclusively for the Rajput Community",
          description:
            "Our platform is tailored to the needs and preferences of Rajput families, making it easier to find matches within the community.",
        },
        {
          title: "Verified Profiles",
          description:
            "We prioritize your safety by ensuring every profile is thoroughly verified.",
        },
        {
          title: "Advanced Matchmaking",
          description:
            "Our platform suggests compatible matches based on your preferences, including education, profession, lifestyle, and values.",
        },
        {
          title: "Respect for Traditions",
          description:
            "We understand the importance of Rajput customs and ensure they are honored throughout the matchmaking process.",
        },
        {
          title: "Dedicated Support",
          description:
            "Our team is here to assist you at every step, ensuring a seamless experience.",
        },
      ];

  const heroBgImage = resolveImage(aboutData?.heroImage, royalimg);

  return (
    <>
      <div style={{ backgroundColor: "#fcfaf9", minHeight: "100vh" }} className="pb-bottom-nav">
        <Profilenavbar />
        
        {/* Cinematic Hero Section */}
        <section className="position-relative overflow-hidden d-flex align-items-center justify-content-center" style={{ minHeight: "70vh", width: "100%", marginTop: 0 }}>
      

          {/* Background Image */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
          >
              <img src={heroBgImage} alt="About Us Background" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          </motion.div>

          {/* Maroon/Gold Theme Overlay */}
          <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(135deg, rgba(80, 0, 0, 0.7) 0%, rgba(20, 0, 0, 0.95) 100%)",
              zIndex: 1
          }}></div>

          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center w-100"
            style={{ zIndex: 10, position: "relative", padding: "0 20px", maxWidth: "900px" }}
          >
            <p style={{ fontSize: "clamp(13px, 14px, 16px)", fontWeight: 600, fontFamily: "var(--font-body)", color: "#e8c371", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "0.75rem", textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}>
              {aboutData?.heroSubtitle || "Who We Are"}
            </p>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 48px)", fontWeight: 600, fontFamily: "var(--font-heading)", lineHeight: 1.25, color: "#ffffff", textShadow: "2px 2px 10px rgba(0,0,0,0.6)", marginBottom: "1rem" }}>
              {aboutData?.heroTitleLine1 || "Celebrating Rajput Legacy,"} <br/>
              <span style={{ color: "#e8c371" }}>{aboutData?.heroTitleLine2 || "Connecting Hearts"}</span>
            </h1>
            <p style={{ fontSize: "clamp(14px, 4vw, 17px)", fontFamily: "var(--font-body)", color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, textShadow: "1px 1px 4px rgba(0,0,0,0.8)", maxWidth: "700px", margin: "0 auto" }}>
              {aboutData?.heroDescription || "Dedicated to uniting Rajput families through meaningful matches, we honor tradition while embracing modern connections."}
            </p>
          </motion.div>
        </section>

        <div className="container" style={{ position: "relative", zIndex: 10, marginTop: "-80px", paddingBottom: "2rem" }}>

          {/* Core Stories / Info Cards Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="row g-3 g-md-5 mb-5"
          >
            {/* Story Card 1 */}
            <motion.div variants={itemVariants} className="col-12 col-md-6">
              <div 
                className="bg-white rounded-4 overflow-hidden h-100 shadow-sm transition-all" 
                style={{ 
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  transform: "translateY(0)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(128,0,0,0.06), 0 0 0 1px rgba(212,175,55,0.2) inset";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ height: "350px", overflow: "hidden" }}>
                  <img
                    className="w-100 h-100 object-fit-cover"
                    src={storyData[0].imageSrc}
                    alt="About matches"
                    style={{ transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
                <div className="p-4">
                  <p className="card-text text-secondary mb-0" style={{ fontSize: "1.05rem", lineHeight: "1.8", fontFamily: "var(--font-body)" }}>
                    {storyData[0].text}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Story Card 2 */}
            <motion.div variants={itemVariants} className="col-12 col-md-6">
              <div 
                className="bg-white rounded-4 overflow-hidden h-100 shadow-sm transition-all" 
                style={{ 
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  transform: "translateY(0)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(128,0,0,0.06), 0 0 0 1px rgba(212,175,55,0.2) inset";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ height: "350px", overflow: "hidden" }}>
                  <img
                    className="w-100 h-100 object-fit-cover"
                    src={storyData[1].imageSrc}
                    alt="Rajput traditions"
                    style={{ transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
                <div className="p-4">
                  <p className="card-text text-secondary mb-0" style={{ fontSize: "1.05rem", lineHeight: "1.8", fontFamily: "var(--font-body)" }}>
                    {storyData[1].text}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Banner Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-4 overflow-hidden shadow-sm mb-5 p-4"
            style={{ 
              background: "linear-gradient(135deg, var(--royal-cream-dark), #ffffff)",
              border: "1px solid rgba(212, 175, 55, 0.3)"
            }}
          >
            <img className="w-100 rounded-3 mb-4" src={resolveImage(aboutData?.bannerImage, imgSrcDefault)} alt="join banner" style={{ maxHeight: "250px", objectFit: "cover" }} />
            <div className="py-2">
              <Features />
            </div>
          </motion.div>

          {/* Ornamental Divider */}
          <div className="text-center my-5">
            <img
              style={{
                width: "100%",
                maxWidth: "800px",
                opacity: 0.8
              }}
              src={border}
              alt="divider border"
            />
          </div>

          {/* Legacy Section */}
          <LegacySection
            leftImage={leftImage}
            rightImage={rightImage}
            title={title}
            paragraphs={paragraphs}
          />

          {/* Divider */}
          <div className="my-5"></div>

          {/* Why Choose Section */}
          <WhyChooseSection
            imageSrc={imageSrc}
            heading={heading}
            features={features}
          />

          {/* CTA VVIP Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="my-5 pt-3"
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
                <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--royal-gold)" }}>{vvipData.title}</h2>
                <p className="lead mx-auto mb-4" style={{ maxWidth: "800px", color: "var(--royal-cream)", opacity: 0.9 }}>
                  {vvipData.description}
                </p>
                <Link to={isAuthenticated ? "/search" : "/login"}>
                  <button className="btn mt-3 px-5 py-3 fs-5" style={{ background: "#ffffff", color: "var(--royal-maroon-dark)", fontWeight: "700", borderRadius: "30px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
                    {vvipData.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export const WhyChooseSection = ({ imageSrc, heading, features }) => {
  return (
    <div className="container-fluid py-4 mb-5">
      <div className="row g-3 g-md-5 align-items-center justify-content-center">
        {/* Why Choose Image */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageLeftVariants}
          className="col-12 col-lg-5 text-center"
        >
          <div 
            className="p-2 d-inline-block rounded-4" 
            style={{ 
              border: "2px solid var(--royal-gold)",
              boxShadow: "0 10px 30px rgba(212, 175, 55, 0.15)"
            }}
          >
            <img
              alt="A traditional Rajput wedding scene"
              className="img-fluid rounded-3"
              src={imageSrc}
              style={{
                maxHeight: "500px",
                width: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        </motion.div>

        {/* Feature List */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="col-12 col-lg-7"
        >
          <motion.h2 
            variants={itemVariants} 
            className="display-5 fw-bold mb-4" 
            style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}
          >
            {heading}
          </motion.h2>

          <div className="d-flex flex-column gap-3">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants} 
                className="d-flex gap-3 p-3 rounded-3"
                style={{ 
                  background: "#ffffff", 
                  borderLeft: "4px solid var(--royal-gold)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
                  border: "1px solid rgba(0,0,0,0.03)"
                }}
              >
                {/* Number Badge */}
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    backgroundColor: "var(--royal-cream-dark)", 
                    color: "var(--royal-maroon-dark)", 
                    border: "1px solid var(--royal-gold)" 
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <h4 className="fw-bold mb-1" style={{ fontSize: "1.15rem", color: "var(--royal-maroon)", fontFamily: "var(--font-heading)" }}>
                    {feature.title}
                  </h4>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const LegacySection = ({ leftImage, rightImage, title, paragraphs }) => {
  return (
    <div className="container-fluid py-4 my-5">
      <div className="row g-5 align-items-center justify-content-center">
        {/* Left Legacy Image */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageLeftVariants}
          className="col-12 col-md-4 col-lg-3 text-center"
        >
          <div 
            className="p-1 d-inline-block rounded-3" 
            style={{ 
              border: "1px solid rgba(212, 175, 55, 0.4)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)"
            }}
          >
            <img
              alt="Traditional Rajput warrior"
              className="img-fluid rounded-2"
              src={leftImage}
              style={{
                maxHeight: "350px",
                objectFit: "cover"
              }}
            />
          </div>
        </motion.div>

        {/* Center Legacy Text */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="col-12 col-md-8 col-lg-6 text-center text-md-start"
        >
          <motion.h2 
            variants={itemVariants} 
            className="display-5 fw-bold mb-4" 
            style={{ fontFamily: "var(--font-heading)", color: "var(--royal-maroon-dark)" }}
          >
            {title}
          </motion.h2>

          <div className="d-flex flex-column gap-3 text-secondary" style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
            {paragraphs.map((paragraph, index) => (
              <motion.p key={index} variants={itemVariants}>
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Right Legacy Image */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageRightVariants}
          className="col-12 col-md-12 col-lg-3 text-center"
        >
          <div 
            className="p-2 d-inline-block rounded-4" 
            style={{ 
              border: "2px solid var(--royal-gold)",
              boxShadow: "0 10px 30px rgba(212, 175, 55, 0.12)"
            }}
          >
            <img
              alt="Rajput ceremony"
              className="img-fluid rounded-3"
              src={rightImage}
              style={{
                maxHeight: "400px",
                width: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
