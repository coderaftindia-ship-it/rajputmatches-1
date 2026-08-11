import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../api";
import { publicApi } from "../../api/public.api";

// Styles and Components
import style from "../Profile/ProfileComp/Profile.module.css";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { VVIPSection } from "./FeatureSection";

// Style for Card Modal
import styles from "../Profile/Forms/Form.module.css";

import SS1 from "../../assets/images/stories/SS1.jpg";
import SS2 from "../../assets/images/stories/SS2.jpg";

const STORY_DURATION = 5000; // 5 seconds per story

function Stories() {
  const getImageSrc = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return image;
    if (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    const cleanPath = image.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${BASE_URL}${formattedPath}`;
  };


  const [storyData, setStoryData] = useState(() => {
    try {
      const cached = localStorage.getItem("api_cache_storiesData");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 1,
        image: SS1,
        title: "Samrat & Rajeshwari",
        description:
          "When Veer, a brave and ambitious entrepreneur, and Rani, a compassionate teacher, joined our platform, little did they know they were about to embark on a journey of a lifetime.",
      },
      {
        id: 2,
        image: SS2,
        title: "Raj & Siya",
        description:
          "A beautiful tale of destiny bringing two souls together. Their families connected through our platform, and it was love at first sight.",
      },
      {
        id: 3,
        image: SS1,
        title: "Vikram & Anjali",
        description:
          "They lived in different cities but shared the same values. Our platform bridged the distance and helped them find true companionship.",
      },
      {
        id: 4,
        image: SS2,
        title: "Aditya & Meera",
        description:
          "From casual conversations to deep connections, their journey is a testament to the fact that soulmates do exist.",
      },
      {
        id: 5,
        image: SS1,
        title: "Karan & Neha",
        description:
          "A classic tale of opposites attract. Karan's adventurous spirit perfectly complemented Neha's calm demeanor.",
      },
      {
        id: 6,
        image: SS2,
        title: "Rahul & Priya",
        description:
          "Their families initiated the conversation, but it was their shared love for travel that sealed the deal.",
      },
    ];
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cmsData, setCmsData] = useState(() => {
    const defaultCms = {
      heroSupertitle: "Real Love Stories",
      heroTitle: "Where Tradition Meets <br/> True Love.",
      heroDescription: "Discover how our exclusive matchmaking has helped countless couples build a beautiful legacy together. Your forever begins right here.",
      vvipTitle: "VVIP Services for Ultimate Discretion",
      vvipDescription: "For those seeking an even more exclusive experience, our VVIP membership provides a personal matchmaking manager, access to non-listed profiles, and personalized introductions.",
      vvipButtonText: "Join the Rajput Legacy"
    };
    try {
      const cached = localStorage.getItem("api_cache_storiesCMS_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) return { ...defaultCms, ...parsed };
      }
    } catch (e) {}
    return defaultCms;
  });
  
  // Hero Section Slideshow State
  const dynamicHeroImages = storyData
    .map((s) => getImageSrc(s.image))
    .filter(Boolean);
  const heroImages = dynamicHeroImages.length > 0 ? dynamicHeroImages : [SS1, SS2];
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  const { fetchUserData } = useAuth();

  const openModal = (index) => {
    setActiveIndex(index);
  };

  const closeModal = () => {
    setActiveIndex(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const route = "profile/stories";
      const res = await fetchUserData(route);
      const list = Array.isArray(res)
        ? res
        : (res?.stories || res?.user || res?.data || []);
      if (list && list.length > 0) {
        setStoryData(list);
        try { localStorage.setItem("api_cache_storiesData", JSON.stringify(list)); } catch (e) {}
      }

      const cmsRes = await publicApi.getStoriesCMS();
      if (cmsRes?.data?.success && cmsRes?.data?.data) {
        setCmsData((prev) => ({ ...prev, ...cmsRes.data.data }));
        try { localStorage.setItem("api_cache_storiesCMS_data", JSON.stringify(cmsRes.data.data)); } catch (e) {}
      }
    } catch (err) {
      console.error("Error fetching stories data:", err);
    } finally {
      setLoading(false);
    }
  };

  const vvipData = {
    title: cmsData.vvipTitle,
    description: cmsData.vvipDescription,
    buttonText: cmsData.vvipButtonText,
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <div className={style.minhScreen} style={{ position: "relative", overflow: "hidden", background: "#fcfaf9" }}>
        
        <Profilenavbar />

        {/* Hero Section with Moving Background Image - Full Width & Touching Top */}
        <section className="position-relative overflow-hidden d-flex align-items-center justify-content-center" style={{ minHeight: "65vh", width: "100%", marginTop: 0 }}>
          
     

          {/* Moving Background Image (Slideshow/Video Effect) */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}>
            <AnimatePresence>
              <motion.img
                key={currentHeroIdx}
                src={heroImages[currentHeroIdx]}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.15 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  scale: { duration: 15, ease: "linear" }
                }}
                alt="Love Story Background"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AnimatePresence>
          </div>

          {/* Theme-Colored Overlay for Text Readability (Maroon/Gold theme) */}
          <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(135deg, rgba(100, 0, 0, 0.6) 0%, rgba(20, 0, 0, 0.95) 100%)",
              zIndex: 1
          }}></div>

          {/* Center Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
            style={{ zIndex: 10, position: "relative", padding: "0 20px", maxWidth: "800px" }}
          >
            <p
              style={{
                fontSize: "clamp(14px, 16px, 18px)",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                color: "#e8c371", // Elegant Gold color
                textTransform: "uppercase",
                letterSpacing: "4px",
                marginBottom: "1rem",
                textShadow: "1px 1px 3px rgba(0,0,0,0.8)"
              }}
            >
              {cmsData.heroSupertitle}
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 44px, 52px)",
                fontWeight: 600,
                fontFamily: "var(--font-heading)",
                lineHeight: 1.3,
                color: "#ffffff",
                textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
                marginBottom: "1.5rem"
              }}
              dangerouslySetInnerHTML={{ __html: cmsData.heroTitle }}
            />
            <p
              style={{
                fontSize: "clamp(16px, 18px, 20px)",
                fontFamily: "var(--font-body)",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.6,
                textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              {cmsData.heroDescription}
            </p>
          </motion.div>
        </section>

        <div className={style.Container} style={{ paddingTop: "4rem", position: "relative", zIndex: 1 }}>

          {/* Content */}
          <div className="row p-2 justify-content-center">
            {loading ? (
              <div className="d-flex justify-content-center w-100 mt-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger w-100 text-center mt-4">
                {error}
              </div>
            ) : (
              storyData.map((story, index) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={story.id || index}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="card border-0 shadow"
                    style={{ 
                        borderRadius: "20px", 
                        overflow: "hidden", 
                        cursor: "pointer",
                        background: "#fff",
                        height: "100%",
                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)"
                    }}
                    onClick={() => openModal(index)}
                  >
                    <div style={{ position: "relative", overflow: "hidden", paddingTop: "120%" }}>
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={getImageSrc(story.image)}
                          alt={story.title}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)",
                            padding: "40px 20px 20px 20px",
                            color: "white"
                        }}>
                            <motion.h5 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                style={{ 
                                    fontFamily: "var(--font-heading)", 
                                    fontSize: "26px", 
                                    marginBottom: "10px",
                                    fontWeight: "500",
                                    color: "#ffffff",
                                    textShadow: "1px 1px 3px rgba(0,0,0,0.8)"
                                }}
                            >
                                {story.title}
                            </motion.h5>
                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "15px",
                                opacity: 0.9,
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                                margin: 0,
                                lineHeight: "1.5",
                                color: "#f0f0f0",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
                            }}>
                                {story.description}
                            </p>
                        </div>
                    </div>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        
          <VVIPSection 
            title={vvipData.title} 
            description={vvipData.description} 
            buttonText={vvipData.buttonText} 
          />
        </div>
      </div>
      <Footer />
      
      {/* Immersive Story Player Overlay */}
      <AnimatePresence>
        {activeIndex !== null && (
          <StoryPlayer 
            stories={storyData} 
            currentIndex={activeIndex} 
            closeModal={closeModal}
            setIndex={setActiveIndex}
            getImageSrc={getImageSrc}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Stories;

// Component for the Fullscreen Story Player
function StoryPlayer({ stories, currentIndex, closeModal, setIndex, getImageSrc }) {
  const story = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setIndex(currentIndex + 1);
    } else {
      closeModal();
    }
  }, [currentIndex, stories.length, setIndex, closeModal]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIndex(currentIndex - 1);
    }
  }, [currentIndex, setIndex]);

  // Auto-advance timer
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, STORY_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, handleNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(15px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Close Button */}
      <motion.button 
        whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.9 }}
        onClick={closeModal}
        style={{
            position: "absolute",
            top: "25px",
            right: "25px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            zIndex: 100001
        }}
      >
        <AiOutlineClose size={22} />
      </motion.button>

      {/* Main Story Container */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
            position: "relative",
            width: "100%",
            maxWidth: "480px",
            height: "100%",
            maxHeight: "85vh",
            background: "#000",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        {/* Progress Bars */}
        <div style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            right: "15px",
            display: "flex",
            gap: "6px",
            zIndex: 100000
        }}>
            {stories.map((_, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: "4px",
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "4px",
                    overflow: "hidden"
                }}>
                    <motion.div
                        initial={{ width: i < currentIndex ? "100%" : "0%" }}
                        animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                        transition={{ 
                            duration: i === currentIndex ? STORY_DURATION / 1000 : 0, 
                            ease: "linear" 
                        }}
                        style={{
                            height: "100%",
                            background: "#fff",
                            borderRadius: "4px"
                        }}
                    />
                </div>
            ))}
        </div>

        {/* Story Image */}
        <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: STORY_DURATION / 1000, ease: "linear" }}
            src={getImageSrc(story.image)} 
            alt={story.title}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
            }}
        />

        {/* Navigation Overlays */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", zIndex: 99999 }}>
            <div onClick={handlePrev} style={{ flex: 1, cursor: "pointer" }} />
            <div onClick={handleNext} style={{ flex: 1, cursor: "pointer" }} />
        </div>

        {/* Story Info Gradient Overlay */}
        <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "60px 30px 40px 30px",
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)",
            color: "white",
            pointerEvents: "none"
        }}>
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
                <div style={{ 
                    display: "inline-block",
                    padding: "6px 12px",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "12px"
                }}>
                    Featured Story
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "16px", fontSize: "32px", lineHeight: "1.2" }}>
                    {story.title}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
                    {story.description}
                </p>
            </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
