import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../component/Layout/AuthContext";
import "../App.css";
import "./Login.css";

import { 
  FaRegEye, 
  FaRegEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaHeart 
} from "react-icons/fa";
import { validateLoginUsername } from "../utils/authValidation";
import lotusLogoImg from "../assets/images/lotus_ra_logo.png";

function Login() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const verify = () => {
    const newErrors = {};
    const usernameError = validateLoginUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password length is not sufficient.";
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = "Please agree to the Terms of Use & Privacy Policy.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verify()) {
      const route = "login";
      const loginPayload = {
        username: formData.username.trim(),
        email: formData.username.trim(),
        password: formData.password,
      };
      try {
        const res = await login(route, loginPayload);
        if (res?.success) {
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  const handleSocialClick = (platformName) => {
    console.log(`Continue with ${platformName}`);
  };

  return (
    <div className="ref-outer-container">
      {/* Outer Purple Canvas Backdrop & Organic Smoke Glow */}
      <div className="ref-outer-bg-gradient"></div>
      <div className="ref-outer-smoke-left"></div>
      <div className="ref-outer-smoke-right"></div>

      {/* Centered Phone Frame Device */}
      <div className="ref-phone-device">
        {/* Top Status Bar with Skip & Dynamic Island */}
        <div className="ref-phone-topbar">
          <button 
            type="button" 
            className="ref-skip-button"
            onClick={() => navigate("/home")}
          >
            Skip
          </button>
          
          <div className="ref-notch-pill"></div>

          <div className="ref-status-right-icons">
            {/* Cellular Signal Icon */}
            <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
              <rect x="4" y="6" width="2.5" height="6" rx="0.5" />
              <rect x="8" y="3" width="2.5" height="9" rx="0.5" />
              <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
            </svg>
            {/* Wi-Fi Icon */}
            <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              <path d="M4.5 7.5a5 5 0 017 0 .75.75 0 001.06-1.06 6.5 6.5 0 00-9.12 0 .75.75 0 101.06 1.06z" />
              <path d="M2 4.8a8.5 8.5 0 0112 0 .75.75 0 001.06-1.06 10 10 0 00-14.12 0 .75.75 0 101.06 1.06z" />
            </svg>
            {/* Battery Icon */}
            <svg width="19" height="11" viewBox="0 0 24 12" fill="currentColor">
              <rect x="1" y="1" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="3" width="12" height="6" rx="1" />
              <path d="M21 4.5v3a1.5 1.5 0 001.5-1.5v0A1.5 1.5 0 0021 4.5z" />
            </svg>
          </div>
        </div>

        {/* Phone Upper Section */}
        <div className="ref-phone-upper-content">
          <div className="ref-upper-vignette"></div>

          <img 
            src={lotusLogoImg} 
            alt="Rajput Alliances Lotus Logo" 
            className="ref-lotus-logo-image"
          />

          <h1 className="ref-brand-title-text">RAJPUT ALLIANCES</h1>
          <p className="ref-brand-subtitle-text">Connecting Rajputs Worldwide</p>
        </div>

        {/* Lower Cream Section Card */}
        <div className="ref-phone-lower-card">
          <button 
            type="button" 
            className="ref-btn-create-account"
            onClick={() => navigate("/signup")}
          >
            CREATE AN ACCOUNT
          </button>

          <button 
            type="button" 
            className="ref-btn-login-main"
            onClick={() => setShowLoginForm(true)}
          >
            LOG IN
          </button>

          <Link to="/forgot-password" className="ref-forgot-password-link">
            Forgot password?
          </Link>

          <p className="ref-terms-policy-text">
            By continuing, you agree to our{" "}
            <Link to="/terms-of-use" className="ref-terms-policy-anchor">Terms</Link> and{" "}
            <Link to="/privacy-policy" className="ref-terms-policy-anchor">Privacy Policy</Link>
          </p>

          <div className="ref-or-divider-container">
            <div className="ref-or-divider-line"></div>
            <span className="ref-or-divider-text">or continue with:</span>
            <div className="ref-or-divider-line"></div>
          </div>

          {/* Social Buttons Row */}
          <div className="ref-social-icons-row">
            {/* Apple Icon */}
            <button 
              type="button" 
              className="ref-social-button-circle" 
              title="Apple"
              onClick={() => handleSocialClick("Apple")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-.97.05-2.18.66-2.86 1.46-.61.71-1.15 1.87-.99 3.01 1.09.08 2.21-.54 2.86-1.35z"/>
              </svg>
            </button>

            {/* Google Icon */}
            <button 
              type="button" 
              className="ref-social-button-circle" 
              title="Google"
              onClick={() => handleSocialClick("Google")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </button>

            {/* Facebook Icon */}
            <button 
              type="button" 
              className="ref-social-button-circle" 
              title="Facebook"
              onClick={() => handleSocialClick("Facebook")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Microsoft Icon */}
            <button 
              type="button" 
              className="ref-social-button-circle" 
              title="Microsoft"
              onClick={() => handleSocialClick("Microsoft")}
            >
              <svg width="16" height="16" viewBox="0 0 23 23">
                <path fill="#F35325" d="M1 1h10v10H1z"/>
                <path fill="#81BC06" d="M12 1h10v10H12z"/>
                <path fill="#05A6F0" d="M1 12h10v10H1z"/>
                <path fill="#FFBA08" d="M12 12h10v10H12z"/>
              </svg>
            </button>

            {/* Play Store Icon */}
            <button 
              type="button" 
              className="ref-social-button-circle" 
              title="Google Play Store"
              onClick={() => handleSocialClick("PlayStore")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4CAF50" d="M3.6 1.8L13.8 12 3.6 22.2C3.2 21.8 3 21.1 3 20.2V3.8c0-.9.2-1.6.6-2z"/>
                <path fill="#03A9F4" d="M13.8 12L3.6 1.8c.4-.4 1-.6 1.6-.3l12.4 7.1-3.8 3.4z"/>
                <path fill="#FFC107" d="M17.6 8.6l3.5 2c.9.5.9 1.4 0 1.9l-3.5 2-3.8-2.5 3.8-3.4z"/>
                <path fill="#F44336" d="M13.8 12l3.8 3.4-12.4 7.1c-.6.3-1.2.1-1.6-.3L13.8 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Credentials Input Form Modal overlay */}
        {showLoginForm && (
          <div className="ref-credentials-modal-backdrop">
            <div className="ref-credentials-modal-box">
              <div className="ref-modal-top">
                <h3 className="ref-modal-heading">Log In to Your Account</h3>
                <button 
                  type="button" 
                  className="ref-modal-x-btn"
                  onClick={() => setShowLoginForm(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="ref-form-field">
                  <label className="ref-form-label">Email or Mobile Number</label>
                  <div className="ref-form-input-wrapper">
                    <FaEnvelope className="ref-form-input-icon" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Email or Mobile"
                      className="ref-form-input-element"
                    />
                  </div>
                  {errors.username && <span className="ref-form-error">{errors.username}</span>}
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Password</label>
                  <div className="ref-form-input-wrapper">
                    <FaLock className="ref-form-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="ref-form-input-element"
                    />
                    <div 
                      onClick={togglePasswordVisibility}
                      style={{ position: "absolute", right: "12px", cursor: "pointer", color: "#3B0626" }}
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </div>
                  </div>
                  {errors.password && <span className="ref-form-error">{errors.password}</span>}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "11.5px", color: "#5C4E58" }}>
                  <input
                    type="checkbox"
                    id="agreeTermsModalCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ accentColor: "#3B0626" }}
                  />
                  <label htmlFor="agreeTermsModalCheck" style={{ cursor: "pointer" }}>
                    I agree to the Terms of Use & Privacy Policy
                  </label>
                </div>
                {errors.agreeTerms && <span className="ref-form-error" style={{ marginBottom: "12px" }}>{errors.agreeTerms}</span>}

                <button type="submit" className="ref-btn-login-main" style={{ marginBottom: 0 }}>
                  <FaHeart style={{ marginRight: "6px" }} />
                  CONFIRM & LOG IN
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
