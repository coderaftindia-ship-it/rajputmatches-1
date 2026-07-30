import React from "react";
import { FaLock, FaCheckCircle, FaHeart, FaHeadset } from "react-icons/fa";
import "./Home.css";

function Features() {
  return (
    <div className="features">
      <div>
        <FaLock style={{ marginRight: "8px" }} /> Privacy & Confidentiality
      </div>
      <div>
        <FaCheckCircle style={{ marginRight: "8px" }} /> Profile Verification
      </div>
      <div>
        <FaHeart style={{ marginRight: "8px" }} /> Personalized Match
      </div>
      <div>
        <FaHeadset style={{ marginRight: "8px" }} /> Customer Support
      </div>
    </div>
  );
}

export default Features;
