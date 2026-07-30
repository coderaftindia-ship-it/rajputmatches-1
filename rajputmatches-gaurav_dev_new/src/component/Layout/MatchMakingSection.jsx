import React from "react";
import herobg from "../../assets/images/matchmakingbg.jpeg";
import border from "../../assets/images/border.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown, FaCheckCircle, FaStar, FaShieldAlt } from "react-icons/fa";

const MatchmakingSection = () => {
  return (
    <div 
      className="py-5 position-relative overflow-hidden" 
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

      <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-5">
          {/* Left Column: Premium Jharokha Framed Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="col-12 col-lg-6 mb-5 mb-lg-0 d-flex justify-content-center"
          >
            {/* The Royal Jharokha Palace Frame */}
            <div 
              className="position-relative"
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
                className="position-relative w-100 overflow-hidden" 
                style={{ 
                  borderRadius: "185px 185px 16px 16px",
                  border: "6px double var(--royal-gold)",
                  padding: "6px",
                  background: "linear-gradient(45deg, var(--royal-maroon-dark), var(--royal-maroon))"
                }}
              >
                <img 
                  src={herobg} 
                  alt="Royal Rajput Matchmaking" 
                  className="img-fluid w-100" 
                  style={{ 
                    objectFit: "cover", 
                    minHeight: "450px",
                    borderRadius: "175px 175px 10px 10px",
                    transition: "transform 0.8s ease",
                    filter: "brightness(0.97) contrast(1.03)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                
                {/* Traditional Rajput Gold Corners */}
                <div style={{ position: "absolute", top: "180px", left: "15px", width: "16px", height: "16px", borderLeft: "2px solid var(--royal-gold)", borderTop: "2px solid var(--royal-gold)" }}></div>
                <div style={{ position: "absolute", top: "180px", right: "15px", width: "16px", height: "16px", borderRight: "2px solid var(--royal-gold)", borderTop: "2px solid var(--royal-gold)" }}></div>
                <div style={{ position: "absolute", bottom: "15px", left: "15px", width: "16px", height: "16px", borderLeft: "2px solid var(--royal-gold)", borderBottom: "2px solid var(--royal-gold)" }}></div>
                <div style={{ position: "absolute", bottom: "15px", right: "15px", width: "16px", height: "16px", borderRight: "2px solid var(--royal-gold)", borderBottom: "2px solid var(--royal-gold)" }}></div>
              </div>

              {/* Lower frame Cultural Accent Info */}
              <div className="d-flex justify-content-center mt-3 gap-3 text-muted w-100 px-3" style={{ fontSize: "0.82rem", fontWeight: "600", letterSpacing: "1px" }}>
                <span className="d-flex align-items-center gap-1.5"><FaCheckCircle color="var(--royal-gold-dark)" /> Verified Legacy</span>
                <span style={{ color: "var(--royal-gold)" }}>•</span>
                <span className="d-flex align-items-center gap-1.5"><FaShieldAlt color="var(--royal-gold-dark)" /> 100% Secure</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Heritage Text & Luxury UX Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="col-12 col-lg-6 text-center text-lg-start px-lg-5"
          >
            {/* Heritage Badge */}
            <div className="mb-4">
              <span 
                className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
                style={{ 
                  color: "var(--royal-gold-dark)", 
                  background: "rgba(237, 177, 57, 0.08)",
                  border: "1.5px solid rgba(237, 177, 57, 0.3)",
                  letterSpacing: "3px", 
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  textTransform: "uppercase"
                }}
              >
                <FaCrown size={12} /> Heritage & Rajput Legacy Matrimony
              </span>
            </div>

            {/* Main Heading */}
            <h2 
              className="display-5 fw-bold mb-4" 
              style={{ 
                fontFamily: "var(--font-heading)", 
                color: "var(--royal-maroon)", 
                lineHeight: "1.25",
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)"
              }}
            >
              Connecting Rajput Families with  <span className="gold-shimmer-text">Trust</span> Tradition & Lasting bonds
            </h2>
            
            <p 
              className="mb-4 text-secondary" 
              style={{ 
                lineHeight: "1.9", 
                fontSize: "1.1rem",
                fontFamily: "var(--font-body)",
                maxWidth: "540px"
              }}
            >
              Step into an exclusive, highly-trusted network designed for noble families. Here, every single profile is strictly verified, connections are deeply meaningful, and matches carry the potential for a lasting royal legacy.
            </p>

            {/* Traditional Bullet highlights */}
            <div className="row g-3 mb-5 text-start mx-auto mx-lg-0" style={{ maxWidth: "480px" }}>
              <div className="col-12 col-sm-6 d-flex align-items-start gap-2">
                <span className="mt-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "var(--royal-gold)", borderRadius: "50%", color: "var(--royal-maroon-dark)", fontSize: "0.75rem", fontWeight: "bold" }}>✓</span>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "var(--royal-maroon)" }}>Strict Verification</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>100% ID & family check</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-start gap-2">
                <span className="mt-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "var(--royal-gold)", borderRadius: "50%", color: "var(--royal-maroon-dark)", fontSize: "0.75rem", fontWeight: "bold" }}>✓</span>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "var(--royal-maroon)" }}>Royal Custom Filters</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Match by heritage & values</p>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <Link to="/login">
              <button 
                className="royal-button px-5 py-3 fs-5 shadow-lg border-0"
                style={{
                  letterSpacing: "2px",
                  transition: "all 0.35s ease",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  boxShadow: "0 10px 25px rgba(89, 18, 59, 0.25)"
                }}
              >
                Find Your Royal Match
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Traditional Border Underneath */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mt-5 pt-4"
        >
          <img
            style={{ width: "100%", maxWidth: "900px", height: "auto", opacity: 0.8 }}
            src={border}
            alt="Decorative border"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MatchmakingSection;
