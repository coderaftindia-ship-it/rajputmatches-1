import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import { authApi } from "../api/auth.api";
import { useAuth } from "../component/Layout/AuthContext";
import { FaEnvelope, FaLock, FaHeart, FaCrown } from "react-icons/fa";
import "./Login.css";

export default function EmailOtpVerify() {
  const { email } = useAuth();
  const [localEmail, setLocalEmail] = useState(email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localEmail) {
      // If no email in context, redirect to enter email page
      navigate("/auth/emailverification");
    }
  }, [localEmail, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      const res = await authApi.sendVerification({ email: localEmail });
      if (res && res.data && res.data.success !== false) {
        toast.success("OTP sent successfully!", { position: "top-center" });
        setTimer(30); // reset 30s cooldown
      } else {
        toast.error(res?.data?.message || "Failed to send OTP", { position: "top-center" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error sending OTP", { position: "top-center" });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email: localEmail, otp });
      if (res && res.data && res.data.success) {
        toast.success(res.data.message || "OTP verified", { position: "top-center" });
        // Persist any needed flag in localStorage so signup page can read it
        localStorage.setItem("verifiedEmail", localEmail);
        navigate("/signup?verified=true");
      } else {
        toast.error(res?.data?.message || "Invalid or expired OTP", { position: "top-center" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error verifying OTP", { position: "top-center" });
    } finally {
      setLoading(false);
    }
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
            <p className="royal-auth-subtitle">Verify Your OTP</p>
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

            <form onSubmit={handleVerify}>
              <div className="royal-form-group">
                <label className="royal-input-label">Email Address</label>
                <div className="royal-input-wrapper">
                  <FaEnvelope className="royal-input-icon" />
                  <input
                    type="email"
                    value={localEmail}
                    className="royal-input"
                    disabled
                  />
                </div>
              </div>

              <div className="royal-form-group">
                <label className="royal-input-label">Enter OTP</label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                    placeholder="123456"
                    className="royal-input"
                  />
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", marginTop: "-0.5rem" }}>
                {timer > 0 ? (
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    Resend OTP in <strong style={{ color: "var(--royal-maroon, #991c1c)" }}>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--royal-maroon, #991c1c)",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      transition: "color 0.2s"
                    }}
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              <button type="submit" className="royal-submit-btn" disabled={loading}>
                <FaHeart className="royal-submit-btn-icon" />
                {loading ? "Verifying..." : "Verify OTP"}
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
