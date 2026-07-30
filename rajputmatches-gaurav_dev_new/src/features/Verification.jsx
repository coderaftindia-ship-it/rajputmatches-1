import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import { useAuth } from "../component/Layout/AuthContext";
import { authApi, isSuccessResponse } from "../api";
import { FaEnvelope, FaHeart, FaCrown } from "react-icons/fa";
import "./Login.css";

function Verification() {
  const { setEmail, email } = useAuth();
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (timer > 0 || loading) return;

    setLoading(true);

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|aol|icloud)\.(com|co|in)$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.sendVerification({ email });

      if (isSuccessResponse(response)) {
        toast.success("Email sent successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimer(120);
        // save email in context and navigate to OTP verification page
        navigate("/auth/otp-verify");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send Email.", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/auth/emailverification");
    }

    setLoading(false);
  };

  return (
    <>
      <Profilenavbar />
      <div className="royal-auth-container">
        <div className="royal-auth-overlay"></div>
        <div className="royal-auth-card">
          <button 
            type="button" 
            className="royal-close-btn" 
            onClick={() => navigate("/home")}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="royal-auth-header">
            <div className="royal-crown-badge">
              <FaCrown className="royal-crown-icon" />
            </div>
            <h2 className="royal-auth-title">Begin Your Royal Journey</h2>
            <p className="royal-auth-subtitle">Verify Your Email</p>
            <div className="royal-divider">
              <span className="royal-divider-ornament">
                <FaCrown style={{ fontSize: "0.8rem", verticalAlign: "middle" }} />
              </span>
            </div>
          </div>

          <div className="royal-auth-body">
            <div className="royal-tab-toggle">
              <button 
                type="button" 
                className="royal-tab-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button 
                type="button" 
                className="royal-tab-btn active"
                onClick={() => navigate("/auth/emailverification")}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="royal-form-group">
                <label htmlFor="email" className="royal-input-label">
                  Email Address
                </label>
                <div className="royal-input-wrapper">
                  <FaEnvelope className="royal-input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="royal-input"
                    disabled={timer > 0 || loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="royal-submit-btn"
                disabled={timer > 0 || loading}
              >
                <FaHeart className="royal-submit-btn-icon" />
                {loading
                  ? "Sending..."
                  : timer > 0
                  ? `Resend in ${timer}s`
                  : "Verify Email"}
              </button>
            </form>

            <p className="royal-footer-text">
              Already have an account? 
              <Link to="/login" className="royal-footer-link">
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
