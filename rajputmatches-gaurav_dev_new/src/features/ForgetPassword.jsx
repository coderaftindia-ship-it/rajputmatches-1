import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import { authApi, extractMessage, isSuccessResponse } from "../api";
import { validateLoginUsername } from "../utils/authValidation";
import { FaEnvelope, FaHeart, FaCrown } from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettingsContext";

function ForgotPassword() {
  const { siteSettings } = useSiteSettings();
  const [logoError, setLogoError] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verify = () => {
    const newErrors = {};

    if (formData.username.length > 40) {
      newErrors.username = "Username must not exceed 40 characters.";
    } else {
      const usernameError = validateLoginUsername(formData.username);
      if (usernameError) {
        newErrors.username = usernameError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verify()) return;

    try {
      const response = await authApi.forgotPassword(formData);
      const message = extractMessage(response);

      if (isSuccessResponse(response)) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending the reset link.",
        { position: "top-center", autoClose: 1500 }
      );
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
            onClick={() => navigate("/login")}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="royal-auth-header">
            <div className="royal-crown-badge">
              {siteSettings.logo && !logoError ? (
                <img
                  src={siteSettings.logo}
                  alt={siteSettings.companyName || "Logo"}
                  onError={() => setLogoError(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", padding: 0 }}
                />
              ) : (
                <FaCrown className="royal-crown-icon" />
              )}
            </div>
            <h2 className="royal-auth-title">Rajput Alliances</h2>
            <p className="royal-auth-subtitle">Forgot Password</p>
            <div className="royal-divider">
              <span className="royal-divider-ornament">
                <FaCrown style={{ fontSize: "0.8rem", verticalAlign: "middle" }} />
              </span>
            </div>
          </div>

          <div className="royal-auth-body">
            <form onSubmit={handleSubmit}>
              <div className="royal-form-group">
                <label htmlFor="username" className="royal-input-label">
                  Email Address
                </label>
                <div className="royal-input-wrapper">
                  <FaEnvelope className="royal-input-icon" />
                  <input
                    id="username"
                    name="username"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.username}
                    onChange={handleChange}
                    className="royal-input"
                  />
                </div>
                {errors.username && (
                  <span className="royal-error-text">{errors.username}</span>
                )}
              </div>

              <button type="submit" className="royal-submit-btn">
                <FaHeart className="royal-submit-btn-icon" />
                Reset Password
              </button>
            </form>

            <p className="royal-footer-text">
              Remembered your password? 
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

export default ForgotPassword;
