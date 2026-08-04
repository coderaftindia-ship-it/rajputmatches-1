import React, { useState, useEffect } from "react";
import "./Home.css";
import Navbar from "./Navbar";
import { LiaSearchSolid } from "react-icons/lia";
import { FaCrown, FaCheckCircle, FaUsers, FaStar, FaRegBuilding, FaVenus, FaMars, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa";
import Features from "./Features";
import { useAuth } from "./AuthContext";
import Bannerbg from "../../assets/images/bannerbg.png";
import { Navigate } from "react-router-dom";
import { publicApi, BASE_URL } from "../../api";

const DEFAULT_CMS = {
  heroBadgeText: "Trusted Since 2009",
  heroTitleLine1: "Where Royalty",
  heroTitleLine2: "Meets Destiny",
  heroDescription:
    "India's premium royal matrimonial service. Discover verified, dignified matches from distinguished families — crafted for unions that honour tradition and celebrate love.",
  heroCTA1Text: "Begin Your Journey",
  heroCTA2Text: "Explore Matches",
  heroFooterNote: "Free registration • No hidden charges",
  stat1Value: "100%", stat1Label: "Verified",
  stat2Value: "25,000+", stat2Label: "Members",
  stat3Value: "4.9", stat3Label: "Rating",
  stat4Value: "All", stat4Label: "Communities",
};

function Banner() {
  const { isAuthenticated, setFormData, formData, userData } = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);
  const [cms, setCms] = useState(DEFAULT_CMS);

  // Fetch CMS data
  useEffect(() => {
    publicApi.getHomeCMS()
      .then((res) => {
        if (res?.data?.data) setCms({ ...DEFAULT_CMS, ...res.data.data });
      })
      .catch(() => {});
  }, []);

  // Auto-enforce opposite gender search based on user profile gender
  useEffect(() => {
    if (userData?.gender === "Male" && formData.gender !== "Female") {
      setFormData((prev) => ({ ...prev, gender: "Female" }));
    } else if (userData?.gender === "Female" && formData.gender !== "Male") {
      setFormData((prev) => ({ ...prev, gender: "Male" }));
    }
  }, [userData?.gender, formData.gender, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = value.trimStart();

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setRedirectPath("/login");
    } else {
      setRedirectPath("/search");
    }
  };

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Resolve banner background image
  const bannerBg = cms.bannerBgImage
    ? (cms.bannerBgImage.startsWith("/uploads/") ? `${BASE_URL}${cms.bannerBgImage}` : cms.bannerBgImage)
    : Bannerbg;

  const particleStyles = [
    { left: "10%", animationDelay: "0s", animationDuration: "14s" },
    { left: "25%", animationDelay: "3s", animationDuration: "18s" },
    { left: "40%", animationDelay: "1s", animationDuration: "16s" },
    { left: "55%", animationDelay: "5s", animationDuration: "20s" },
    { left: "70%", animationDelay: "2s", animationDuration: "15s" },
    { left: "85%", animationDelay: "4s", animationDuration: "17s" },
    { left: "95%", animationDelay: "7s", animationDuration: "19s" },
  ];

  const stats = [
    { value: cms.stat1Value, label: cms.stat1Label, icon: <FaCheckCircle color="var(--royal-gold)" /> },
    { value: cms.stat2Value, label: cms.stat2Label, icon: <FaUsers color="var(--royal-gold)" /> },
    { value: cms.stat3Value, label: cms.stat3Label, icon: <FaStar color="var(--royal-gold)" /> },
    { value: cms.stat4Value, label: cms.stat4Label, icon: <FaRegBuilding color="var(--royal-gold)" /> },
  ];

  return (
    <>
      <div
        className="position-relative overflow-hidden banner-wrapper"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden"
        }}
      >
        {/* Cinematic Ken Burns Background Zoom/Pan Effect */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${bannerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
            animation: "kenBurns 30s ease-in-out infinite",
            transformOrigin: "center center",
            willChange: "transform",
            WebkitTransform: "translateZ(0)"
          }}
        ></div>

        {/* Premium Dark Royal Overlay with Maroon and Dark Vignette */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(180deg, rgba(70, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.55) 45%, rgba(20, 20, 20, 0.6) 70%, rgba(70, 0, 0, 0.8) 100%)",
            zIndex: 1
          }}
        ></div>

        {/* Floating Sparks / Gold Particles Effect */}
        <div className="position-absolute w-100 h-100 overflow-hidden" style={{ top: 0, left: 0, zIndex: 2, pointerEvents: "none" }}>
          {particleStyles.map((style, index) => (
            <div
              key={index}
              className="royal-particle"
              style={{
                left: style.left,
                animationDelay: style.animationDelay,
                animationDuration: style.animationDuration
              }}
            />
          ))}
        </div>

        <div style={{ zIndex: 10 }}>
          <Navbar />
        </div>

        <div className="container d-flex flex-column justify-content-center flex-grow-1 position-relative" style={{ zIndex: 3 }}>
          <div className="row align-items-center flex-grow-1 py-4 py-md-5 my-auto">
            {/* Left Column: Text & Badges */}
            <div className="col-12 col-lg-6 text-white pe-lg-5 mb-5 mb-lg-0">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ border: "1px solid rgba(237, 177, 57, 0.4)", background: "rgba(0,0,0,0.2)" }}>
                <FaCrown color="var(--royal-gold)" size={14} />
                <span style={{ fontSize: "0.85rem", color: "var(--royal-gold)", letterSpacing: "0.5px" }}>{cms.heroBadgeText}</span>
              </div>

              <h1 className="display-5 display-md-3 fw-bold mb-3 text-white" style={{ fontFamily: "var(--font-heading)", textShadow: "0 4px 15px rgba(0,0,0,0.85)", lineHeight: "1.15", fontSize: "clamp(1.8rem, 6.5vw, 3.5rem)", color: "#ffffff" }}>
                {cms.heroTitleLine1}<br/>
                <span style={{ color: "var(--royal-gold, #EDB139)" }}>{cms.heroTitleLine2}</span>
              </h1>

              <div className="mb-3 mb-md-4">
                <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10 Q 30 0, 60 10 T 110 10" stroke="var(--royal-gold)" strokeWidth="1.5" fill="none" />
                  <circle cx="60" cy="10" r="3" fill="var(--royal-gold)" />
                  <circle cx="10" cy="10" r="2" fill="var(--royal-gold)" />
                  <circle cx="110" cy="10" r="2" fill="var(--royal-gold)" />
                </svg>
              </div>

              <p className="lead mb-3 mb-md-5" style={{ fontSize: "clamp(0.85rem, 3.2vw, 1.05rem)", maxWidth: "95%", lineHeight: "1.55", color: "rgba(255,255,255,0.92)", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
                {cms.heroDescription}
              </p>

              <div className="d-flex flex-wrap gap-3 mb-3 mb-md-5">
                <button
                  className="royal-button d-flex align-items-center gap-2"
                  style={{ padding: "12px 24px", background: "var(--royal-gold)", color: "var(--royal-dark)", border: "none", borderRadius: "8px", fontWeight: "600" }}
                  onClick={() => setRedirectPath(isAuthenticated ? "/search" : "/login")}
                >
                  <FaRegHeart /> {cms.heroCTA1Text}
                </button>
                <button
                  className="royal-button-outline d-flex align-items-center gap-2"
                  style={{ padding: "12px 24px", background: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px" }}
                  onClick={() => setRedirectPath(isAuthenticated ? "/search" : "/login")}
                >
                  <LiaSearchSolid size={20} /> {cms.heroCTA2Text}
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2 gap-md-4 align-items-center" style={{ fontSize: "clamp(0.72rem, 2.5vw, 0.85rem)", opacity: 0.9 }}>
                {stats.map((stat, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    {stat.icon} {stat.value} {stat.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Search Card */}
            <div className="col-12 col-lg-5 offset-lg-1">
              <form
                onSubmit={handleSubmit}
                className="p-3 p-sm-4 p-md-5 rounded-4 d-flex flex-column home-search-card"
                style={{
                  background: "rgba(252, 245, 234, 0.95)",
                  border: "1.5px solid rgba(212, 175, 55, 0.35)",
                  borderTop: "6px solid var(--royal-maroon)",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
                  color: "var(--royal-text)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)"
                }}
              >
                <div className="text-center mb-4">
                  <span className="d-block mb-1" style={{ color: "var(--royal-gold-dark)", fontSize: "0.8rem", letterSpacing: "3px", fontWeight: "700", textTransform: "uppercase" }}>Find Your Match</span>
                  <h2 className="fw-bold mb-2" style={{ fontSize: "1.85rem", fontFamily: "var(--font-heading)", color: "var(--royal-maroon)" }}>
                    Quick Partner Search
                  </h2>
                  <div className="mx-auto" style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, transparent, var(--royal-gold), transparent)" }}></div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--royal-maroon-dark)", letterSpacing: "0.5px" }}>
                    <FaRegHeart color="var(--royal-gold-dark)" /> Looking For
                  </label>
                  <div className="d-flex gap-3">
                    <label
                      className="flex-grow-1 position-relative"
                      style={{
                        opacity: userData?.gender === "Female" ? 0.4 : 1,
                        cursor: userData?.gender === "Female" ? "not-allowed" : "pointer"
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        disabled={userData?.gender === "Female"}
                        className="visually-hidden"
                      />
                      <div className="d-flex align-items-center justify-content-center gap-2 rounded-pill py-2" style={{
                        background: formData.gender === "Female" ? "linear-gradient(135deg, var(--royal-maroon), var(--royal-maroon-dark))" : "#fff",
                        color: formData.gender === "Female" ? "#fff" : "var(--royal-text-light)",
                        border: `1.5px solid ${formData.gender === "Female" ? "var(--royal-gold)" : "rgba(89,18,59,0.15)"}`,
                        transition: "all 0.3s ease",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        boxShadow: formData.gender === "Female" ? "0 4px 12px rgba(89,18,59,0.2)" : "none"
                      }}>
                        <FaVenus /> Bride
                      </div>
                    </label>
                    <label
                      className="flex-grow-1 position-relative"
                      style={{
                        opacity: userData?.gender === "Male" ? 0.4 : 1,
                        cursor: userData?.gender === "Male" ? "not-allowed" : "pointer"
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        disabled={userData?.gender === "Male"}
                        className="visually-hidden"
                      />
                      <div className="d-flex align-items-center justify-content-center gap-2 rounded-pill py-2" style={{
                        background: formData.gender === "Male" ? "linear-gradient(135deg, var(--royal-maroon), var(--royal-maroon-dark))" : "#fff",
                        color: formData.gender === "Male" ? "#fff" : "var(--royal-text-light)",
                        border: `1.5px solid ${formData.gender === "Male" ? "var(--royal-gold)" : "rgba(89,18,59,0.15)"}`,
                        transition: "all 0.3s ease",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        boxShadow: formData.gender === "Male" ? "0 4px 12px rgba(89,18,59,0.2)" : "none"
                      }}>
                        <FaMars /> Groom
                      </div>
                    </label>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6">
                    <label className="mb-2 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--royal-maroon-dark)" }}>
                      <FaRegBuilding color="var(--royal-gold-dark)" /> Age Range
                    </label>
                    <select
                      name="ageRange"
                      className="form-select rounded-3 w-100"
                      defaultValue="22-30"
                      style={{ height: "45px", background: "#fff", border: "1.5px solid rgba(89,18,59,0.15)", fontSize: "0.92rem", color: "var(--royal-text)" }}
                    >
                      <option value="18-25">18 — 25 years</option>
                      <option value="22-30">22 — 30 years</option>
                      <option value="25-35">25 — 35 years</option>
                      <option value="30-40">30 — 40 years</option>
                      <option value="40+">40+ years</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="mb-2 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--royal-maroon-dark)" }}>
                      <FaMapMarkerAlt color="var(--royal-gold-dark)" /> Location
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="form-control rounded-3 w-100"
                        style={{
                          height: "45px",
                          background: "#fff",
                          border: "1.5px solid rgba(89,18,59,0.15)",
                          fontSize: "0.92rem",
                          color: "var(--royal-text)",
                          paddingLeft: "35px"
                        }}
                      />
                      <FaMapMarkerAlt
                        className="position-absolute"
                        style={{
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(89,18,59,0.4)",
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 text-white mt-2 royal-button"
                  style={{ height: "48px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.95rem" }}
                >
                  <LiaSearchSolid size={20} /> Search Matches
                </button>
                <div className="text-center mt-3">
                  <span style={{ fontSize: "0.75rem", color: "var(--royal-text-light)" }}>{cms.heroFooterNote}</span>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-5 pb-5 d-none d-md-block">
            <Features />
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
