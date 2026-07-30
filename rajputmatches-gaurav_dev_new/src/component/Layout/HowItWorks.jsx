import React from "react";
import { FaUserEdit, FaSearchPlus, FaPaperPlane, FaRing } from "react-icons/fa";
import "./HowItWorks.css";

const STEPS = [
  {
    icon: <FaUserEdit />,
    title: "1. Create Account",
    desc: "Register in under 2 minutes. Complete your basic family, professional, and horoscopic details with ease.",
  },
  {
    icon: <FaSearchPlus />,
    title: "2. Discover Matches",
    desc: "Use our intelligent filters to search elite Rajput profiles based on location, education, clan, and astrology.",
  },
  {
    icon: <FaPaperPlane />,
    title: "3. Connect & Express",
    desc: "Send personalized contact or photo requests to profiles you like, and chat securely inside our app.",
  },
  {
    icon: <FaRing />,
    title: "4. Celebrate Union",
    desc: "Meet family members with trust and confidence, take blessings, and start your lifelong royal journey.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <div className="container text-center">
        <span className="how-eyebrow">✦ Easy Process ✦</span>
        <h2 className="how-title">How It Works</h2>
        <p className="how-subtitle">
          Finding your perfect Rajput match has never been simpler. Just follow these four easy steps.
        </p>

        <div className="how-grid">
          {STEPS.map((s, idx) => (
            <div className="how-card" key={idx}>
              <div className="how-card-badge">{idx + 1}</div>
              <div className="how-icon-circle">{s.icon}</div>
              <h3 className="how-card-title">{s.title}</h3>
              <p className="how-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
