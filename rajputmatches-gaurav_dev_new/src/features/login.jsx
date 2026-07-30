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
  FaHeart, 
  FaCrown 
} from "react-icons/fa";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import { validateLoginUsername } from "../utils/authValidation";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { login, message } = useAuth();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verify()) {
      const route = "login";
      console.log("logging in ");
      console.log({ formData });
      try {
        await login(route, formData);
        navigate("/home");
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      console.log("Form has errors:", errors);
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
            <p className="royal-auth-subtitle">Where Royalty Meets Destiny</p>
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
                className="royal-tab-btn active"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button 
                type="button" 
                className="royal-tab-btn"
                onClick={() => navigate("/auth/emailverification")}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="royal-form-group">
                <label htmlFor="email" className="royal-input-label">
                  Email
                </label>
                <div className="royal-input-wrapper">
                  <FaEnvelope className="royal-input-icon" />
                  <input
                    type="text"
                    id="email"
                    value={formData.username}
                    name="username"
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="royal-input"
                  />
                </div>
                {errors.username && (
                  <span className="royal-error-text">{errors.username}</span>
                )}
              </div>

              <div className="royal-form-group">
                <label htmlFor="password" className="royal-input-label">
                  Password
                </label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="royal-input"
                    autoComplete="current-password"
                  />
                  <div className="royal-password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
                {errors.password && (
                  <span className="royal-error-text">{errors.password}</span>
                )}
              </div>

              <Link to="/forgot-password" className="royal-forgot-link">
                Forgot Password?
              </Link>

              <button type="submit" className="royal-submit-btn">
                <FaHeart className="royal-submit-btn-icon" />
                Login to Your Account
              </button>
            </form>

            <div className="royal-demo-creds">
              Demo admin: admin@shahivivaah.com / admin123
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
