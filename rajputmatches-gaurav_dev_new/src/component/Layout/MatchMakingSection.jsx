import React, { useState, useEffect } from "react";
import herobg from "../../assets/images/matchmakingbg.jpeg";
import border from "../../assets/images/border.png";
import { Link } from "react-router-dom";
import { FaCrown, FaCheckCircle, FaStar, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { publicApi } from "../../api";
import { BASE_URL } from "../../api";

const DEFAULT_CMS = {
  matchBadgeText: "Heritage & Rajput Legacy Matrimony",
  matchHeading: "Connecting Rajput Families with Trust Tradition & Lasting bonds",
  matchDescription:
    "Step into an exclusive, highly-trusted network designed for noble families. Here, every single profile is strictly verified, connections are deeply meaningful, and matches carry the potential for a lasting royal legacy.",
  matchBullet1Title: "Strict Verification",
  matchBullet1Desc: "100% ID & family check",
  matchBullet2Title: "Royal Custom Filters",
  matchBullet2Desc: "Match by heritage & values",
  matchCTAText: "Find Your Royal Match",
  matchmakingImage: "",
};

const MatchmakingSection = () => {
  const { isAuthenticated } = useAuth();
  const [cms, setCms] = useState(DEFAULT_CMS);

  useEffect(() => {
    publicApi.getHomeCMS()
      .then((res) => {
        if (res?.data?.data) setCms({ ...DEFAULT_CMS, ...res.data.data });
      })
      .catch(() => {});
  }, []);

  const matchImg = cms.matchmakingImage
    ? (cms.matchmakingImage.startsWith("/uploads/") ? `${BASE_URL}${cms.matchmakingImage}` : cms.matchmakingImage)
    : herobg;

  return (
    <div
      className="py-3 py-md-5 position-relative overflow-hidden matchmaking-section"
      style={{
        backgroundColor: "var(--royal-cream)",
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(89, 18, 59, 0.04) 0%, transparent 40%)
        `,
        borderTop: "3px solid var(--royal-gold)",
        borderBottom: "3px solid var(--royal-gold)"
      }}
    >
      {/* Decorative Rajasthani Mandala / Jharokha Watermark Left */}
      <div
        className="position-absolute opacity-10 pointer-events-none d-none d-lg-block"
        style={{
          width: "350px",
          height: "350px",
          top: "-50px",
          left: "-100px",
          border: "4px double var(--royal-gold)",
          borderRadius: "50%",
          transform: "rotate(45deg)"
        }}
      >
        <div style={{ width: "100%", height: "100%", border: "2px dashed var(--royal-gold)", borderRadius: "50%", padding: "20px" }}>
          <div style={{ width: "100%", height: "100%", border: "1px solid var(--royal-gold)", borderRadius: "50%" }}></div>
        </div>
      </div>

      <div className="container py-2 py-md-4 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-3 g-md-5">
          {/* Left Column: Premium Jharokha Framed Image */}
          <div className="col-12 col-lg-6 mb-3 mb-lg-0 d-flex justify-content-center">
            {/* The Royal Jharokha Palace Frame */}
            <div
              className="position-relative matchmaking-jharokha-frame"
              style={{
                width: "100%",
                maxWidth: "440px",
                padding: "16px",
                background: "linear-gradient(180deg, #fff 0%, var(--royal-cream) 100%)",
                borderRadius: "200px 200px 24px 24px",
                boxShadow: "0 25px 60px rgba(89, 18, 59, 0.18), 0 0 40px rgba(212, 175, 55, 0.15)",
                border: "2px solid var(--royal-gold)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              {/* Palace Dome (Chhatri) Arch Crest Header */}
              <div
                className="position-absolute start-50 translate-middle-x d-flex flex-column align-items-center"
                style={{
                  top: "-28px",
                  background: "var(--royal-cream)",
                  padding: "6px 24px",
                  borderRadius: "30px",
                  border: "2px solid var(--royal-gold)",
                  zIndex: 4,
                  boxShadow: "0 6px 15px rgba(89, 18, 59, 0.1)"
                }}
              >
                <FaCrown color="var(--royal-gold-dark)" size={20} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
              </div>

              {/* Jharokha Arch Window Body */}
              <div
                className="position-relative w-100 overflow-hidden matchmaking-jharokha-arch"
                style={{
                  borderRadius: "185px 185px 16px 16px",
                  border: "6px double var(--royal-gold)",
                  padding: "6px",
                  background: "linear-gradient(45deg, var(--royal-maroon-dark), var(--royal-maroon))"
                }}
              >
                <img
                  src={matchImg}
                  alt="Royal Rajput Matchmaking"
                  className="img-fluid w-100 matchmaking-img"
                  style={{
                    objectFit: "cover",
                    borderRadius: "175px 175px 10px 10px",
                    transition: "transform 0.8s ease",
                    filter: "brightness(0.97) contrast(1.03)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />

                {/* Traditional Rajput Gold Corners */}
                <div className="matchmaking-corner-tl"></div>
                <div className="matchmaking-corner-tr"></div>
                <div className="matchmaking-corner-bl"></div>
                <div className="matchmaking-corner-br"></div>
              </div>

              {/* Lower frame Cultural Accent Info */}
              <div className="d-flex justify-content-center mt-3 gap-3 text-muted w-100 px-3" style={{ fontSize: "0.82rem", fontWeight: "600", letterSpacing: "1px" }}>
                <span className="d-flex align-items-center gap-1.5"><FaCheckCircle color="var(--royal-gold-dark)" /> Verified Legacy</span>
                <span style={{ color: "var(--royal-gold)" }}>•</span>
                <span className="d-flex align-items-center gap-1.5"><FaShieldAlt color="var(--royal-gold-dark)" /> 100% Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heritage Text & Luxury UX Content */}
          <div className="col-12 col-lg-6 text-center text-lg-start px-lg-5">
            {/* Heritage Badge */}
            <div className="mb-2 mb-md-4">
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
                style={{
                  color: "var(--royal-gold-dark)",
                  background: "rgba(237, 177, 57, 0.08)",
                  border: "1.5px solid rgba(237, 177, 57, 0.3)",
                  letterSpacing: "2px",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  textTransform: "uppercase"
                }}
              >
                <FaCrown size={12} /> {cms.matchBadgeText}
              </span>
            </div>

            {/* Main Heading */}
            <h2
              className="display-5 fw-bold mb-2 mb-md-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--royal-maroon)",
                lineHeight: "1.25",
                fontSize: "clamp(1.5rem, 4.8vw, 3.2rem)"
              }}
            >
              {cms.matchHeading}
            </h2>

            <p
              className="mb-3 mb-md-4 text-secondary"
              style={{
                lineHeight: "1.6",
                fontSize: "clamp(0.88rem, 3.2vw, 1.1rem)",
                fontFamily: "var(--font-body)",
                maxWidth: "540px"
              }}
            >
              {cms.matchDescription}
            </p>

            {/* Traditional Bullet highlights */}
            <div className="row g-2 g-md-3 mb-3 mb-md-4 text-start mx-auto mx-lg-0" style={{ maxWidth: "480px" }}>
              <div className="col-12 col-sm-6 d-flex align-items-start gap-2">
                <span className="mt-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "var(--royal-gold)", borderRadius: "50%", color: "var(--royal-maroon-dark)", fontSize: "0.75rem", fontWeight: "bold" }}>✓</span>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "var(--royal-maroon)" }}>{cms.matchBullet1Title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>{cms.matchBullet1Desc}</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-start gap-2">
                <span className="mt-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "var(--royal-gold)", borderRadius: "50%", color: "var(--royal-maroon-dark)", fontSize: "0.75rem", fontWeight: "bold" }}>✓</span>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "var(--royal-maroon)" }}>{cms.matchBullet2Title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>{cms.matchBullet2Desc}</p>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <Link to={isAuthenticated ? "/search" : "/login"}>
              <button
                className="royal-button px-4 px-md-5 py-2.5 py-md-3 shadow-lg border-0 d-inline-flex align-items-center justify-content-center"
                style={{
                  letterSpacing: "1px",
                  transition: "all 0.35s ease",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontSize: "clamp(0.85rem, 3.8vw, 1.05rem)",
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 25px rgba(89, 18, 59, 0.25)",
                  maxWidth: "92%"
                }}
              >
                {cms.matchCTAText}
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Traditional Border Underneath */}
        <div className="text-center mt-3 mt-md-5 pt-2 pt-md-4 matchmaking-border-img">
          <img
            style={{ width: "100%", maxWidth: "900px", height: "auto", opacity: 0.8 }}
            src={border}
            alt="Decorative border"
          />
        </div>
      </div>
    </div>
  );
};

export default MatchmakingSection;
