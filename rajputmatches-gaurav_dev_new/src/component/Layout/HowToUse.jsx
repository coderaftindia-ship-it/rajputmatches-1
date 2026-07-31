import React, { useState } from "react";
import { Link } from "react-router-dom";
import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { FaUserPlus, FaSlidersH, FaComments, FaRing, FaShieldAlt, FaLock, FaCheckCircle, FaHeart } from "react-icons/fa";

function HowToUse() {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const steps = [
    {
      icon: <FaUserPlus size={28} />,
      title: "1. Create Elite Profile",
      description: "Register with your personal details, education, lineage (Gothra), and family background. Upload professional photos and specify your profile visibility settings.",
      details: "Our system maintains a secure and verified environment. All newly registered profiles undergo a manual vetting process by our compliance team to guarantee authenticity.",
      badge: "Step One"
    },
    {
      icon: <FaSlidersH size={28} />,
      title: "2. Define Preferences",
      description: "Set your specific preferences based on sub-caste, Gothra restrictions, educational background, location, and professional status to filter exactly who you're looking for.",
      details: "Avoid mismatched proposals. Our intelligent search filters out candidates who do not match your family's criteria, giving you a curated, relevant pool of prospects.",
      badge: "Step Two"
    },
    {
      icon: <FaComments size={28} />,
      title: "3. Connect & Chat Securely",
      description: "Send interest requests to profiles you find matching. Once approved, initiate discussions on our secure chat platform without sharing private phone numbers.",
      details: "Communicate on your own terms. Our platform allows complete privacy controls, so you can choose who views your contact information and photos.",
      badge: "Step Three"
    },
    {
      icon: <FaRing size={28} />,
      title: "4. The Royal Union",
      description: "Engage families once there is a mutual match. You can request background details or avail offline support from our dedicated marriage counselors.",
      details: "We walk with you until the wedding day. Share your story with us to inspire the community, and let us celebrate your traditional royal wedding together.",
      badge: "Step Four"
    }
  ];

  const faqs = [
    {
      question: "How do you verify the profiles on Rajput Matches?",
      answer: "Every profile registered on Rajput Matches goes through a manual screening process. We require mandatory mobile verification, email checks, and optionally invite users to provide government-issued IDs to receive a verified badge, ensuring safety and trust."
    },
    {
      question: "Is my personal data and photo secure?",
      answer: "Absolutely. We prioritize your privacy above all else. In your account settings, you can choose who can see your photos (e.g. all members, only accepted members, or password-protected) and control who can request your contact info."
    },
    {
      question: "What is a 'Gothra' filter, and how does it work?",
      answer: "Gothra is crucial in traditional Rajput alliances. Our system allows you to specify your self, maternal, and paternal Gothras, and set exclusions to prevent matching within the same Gothra or specific forbidden branches according to traditional customs."
    },
    {
      question: "Is Rajput Matches completely free to use?",
      answer: "Registration, creating a profile, searching, and showing interest are 100% free. We offer premium membership packages that unlock advanced benefits like direct messaging, counselor assistance, and higher profile visibility."
    },
    {
      question: "How do I edit my profile details later?",
      answer: "Once logged in, simply go to your dashboard, click on 'My Profile' or 'Settings' to update your educational background, lifestyle, family details, and preferences. Some critical details may require a quick review from our team before going live."
    }
  ];

  return (
    <div style={{ backgroundColor: "#fcfaf9", minHeight: "100vh" }} className="pb-bottom-nav">
      <Profilenavbar />

      {/* Cinematic Hero Section */}
      <section className="position-relative overflow-hidden d-flex align-items-center justify-content-center" style={{ minHeight: "50vh", width: "100%", marginTop: 0 }}>
   

        {/* Background Overlay with rich royal theme */}
        <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(135deg, rgba(89, 18, 59, 0.85) 0%, rgba(40, 5, 25, 0.98) 100%)",
            zIndex: 1
        }}></div>

        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(237, 177, 57, 0.1) 0%, transparent 70%)",
          zIndex: 2
        }}></div>

        {/* Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
          style={{ zIndex: 10, position: "relative", padding: "0 20px", maxWidth: "800px", marginTop: "40px" }}
        >
          <p style={{ fontSize: "clamp(12px, 13px, 15px)", fontWeight: 600, color: "var(--royal-gold)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "0.75rem" }}>
            Step-by-Step Guide
          </p>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 44px)", fontWeight: 600, fontFamily: "var(--font-heading)", lineHeight: 1.25, color: "#ffffff", marginBottom: "1rem" }}>
            Your Path to a Noble Match
          </h1>
          <div className="mx-auto mb-3" style={{ width: "80px", height: "2px", background: "var(--royal-gold)" }}></div>
          <p style={{ fontSize: "clamp(14px, 4vw, 17px)", color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, maxWidth: "650px", margin: "0 auto" }}>
            Discover how Rajput Matches combines age-old family values with modern technology to help you find your ideal partner seamlessly and securely.
          </p>
        </motion.div>
      </section>

      {/* Steps Section */}
      <div className="container py-5" style={{ position: "relative", zIndex: 10 }}>
        
        {/* Section Header */}
        <div className="text-center mb-5 mt-3">
          <h2 className="fw-bold" style={{ color: "var(--royal-maroon)", fontSize: "2.2rem" }}>How It Works</h2>
          <p className="text-secondary max-w-xl mx-auto" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Four simple steps to find your life partner, build connections, and embark on a beautiful lifelong marriage journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="row g-4">
          {steps.map((step, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-3">
              <motion.div 
                whileHover={{ y: -8 }} 
                transition={{ type: "spring", stiffness: 300 }}
                className="card h-100 border-0 shadow-sm p-4 text-center bg-white"
                style={{ 
                  borderRadius: "20px", 
                  borderTop: "4px solid var(--royal-gold)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: "70px", 
                    height: "70px", 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(89, 18, 59, 0.06)", 
                    color: "var(--royal-maroon)" 
                  }}
                >
                  {step.icon}
                </div>
                <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ backgroundColor: "rgba(237, 177, 57, 0.12)", color: "var(--royal-gold-dark)", fontSize: "0.8rem", width: "fit-content", margin: "0 auto" }}>
                  {step.badge}
                </span>
                <h4 className="fw-bold fs-5 mb-3" style={{ color: "var(--royal-maroon)" }}>
                  {step.title}
                </h4>
                <p className="text-secondary mb-3" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  {step.description}
                </p>
                <hr className="my-3" style={{ borderColor: "rgba(0,0,0,0.05)" }} />
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem", fontStyle: "italic", lineHeight: "1.5" }}>
                  {step.details}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Security & Trust Highlights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-5 p-4 p-md-5 rounded-4 text-white"
          style={{ 
            background: "linear-gradient(135deg, var(--royal-maroon) 0%, var(--royal-maroon-dark) 100%)",
            boxShadow: "0 15px 35px rgba(89, 18, 59, 0.25)"
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <h3 className="fw-bold mb-3 text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Our Privacy & Security Core
              </h3>
              <p className="mb-4 text-white-50" style={{ fontSize: "1.05rem" }}>
                We understand that matchmaking involves sensitive personal data. That's why we've built top-tier security controls right into the heart of Rajput Matches.
              </p>
              
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-circle bg-white bg-opacity-10 text-warning mt-1">
                    <FaShieldAlt size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-white">100% Vetted Members</h5>
                    <p className="mb-0 text-white-50 small">Every profile is manually examined before joining our matchmaking database.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-circle bg-white bg-opacity-10 text-warning mt-1">
                    <FaLock size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-white">Granular Privacy Control</h5>
                    <p className="mb-0 text-white-50 small">Control who sees your photographs, age, state, or phone number from settings.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-circle bg-white bg-opacity-10 text-warning mt-1">
                    <FaCheckCircle size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-white">No Spam / Advertisements</h5>
                    <p className="mb-0 text-white-50 small">We run a highly clean, ad-free environment purely dedicated to genuine relationships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5 offset-lg-1 text-center">
              <div className="p-4 rounded-4 bg-white text-dark shadow-lg">
                <FaHeart size={50} className="text-danger mb-3" />
                <h4 className="fw-bold mb-2" style={{ color: "var(--royal-maroon-dark)" }}>Are you ready to find your destiny?</h4>
                <p className="text-secondary small mb-4">Join thousands of verified Rajput brides and grooms who have successfully registered their match profiles.</p>
                <div className="d-flex flex-column gap-2">
                  <Link to={isAuthenticated ? "/search" : "/signup"} className="btn text-white w-100 fw-bold" style={{ backgroundColor: "var(--royal-maroon)", padding: "10px" }}>
                    Register for Free
                  </Link>
                  <Link to={isAuthenticated ? "/search" : "/login"} className="btn btn-outline-secondary w-100 fw-semibold" style={{ padding: "10px" }}>
                    Sign In to Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="my-5 pt-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: "var(--royal-maroon)" }}>Frequently Asked Questions</h2>
            <p className="text-secondary">Have questions about the platform? Read our detailed answers below.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="accordion d-flex flex-column gap-3">
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="border rounded-4 bg-white overflow-hidden transition-all shadow-sm"
                      style={{ 
                        borderColor: isOpen ? "rgba(237, 177, 57, 0.4)" : "#e9ecef"
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-100 text-start d-flex justify-content-between align-items-center p-4 bg-white border-0 fw-semibold"
                        style={{ 
                          color: isOpen ? "var(--royal-maroon)" : "var(--royal-text)",
                          fontSize: "1.05rem",
                          outline: "none"
                        }}
                      >
                        <span>{faq.question}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ color: isOpen ? "var(--royal-gold-dark)" : "#6c757d" }}
                        >
                          <AiOutlineDown size={18} />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            <div className="p-4 pt-0 text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.7", borderTop: "1px solid #f8f9fa" }}>
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default HowToUse;
