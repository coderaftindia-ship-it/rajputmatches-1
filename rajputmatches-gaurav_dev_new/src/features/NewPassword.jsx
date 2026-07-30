import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash, FaLock, FaHeart, FaCrown } from "react-icons/fa";
import "../App.css";
import "./Login.css";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import { authApi, isSuccessResponse } from "../api";

function NewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    newpassword: "",
  });
  const [errors, setErrors] = useState({});

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userid");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const verify = () => {
    const newErrors = {};

    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";

    if (!formData.newpassword.trim())
      newErrors.newpassword = "Confirm Password is required.";
    else if (formData.newpassword.length < 6)
      newErrors.newpassword =
        "Confirm Password must be at least 6 characters long.";
    else if (formData.newpassword !== formData.password)
      newErrors.newpassword = "Passwords do not match!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verify()) return;

    try {
      if (!token || !userId) {
        toast.error("Invalid or expired reset link. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      localStorage.setItem("authToken", token);

      const response = await authApi.resetPassword({
        password: formData.password,
        newPassword: formData.newpassword,
      });

      if (isSuccessResponse(response)) {
        toast.success("Password reset successful!", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/login");
      } else {
        throw new Error(response.data?.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { position: "top-center", autoClose: 3000 }
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
              <FaCrown className="royal-crown-icon" />
            </div>
            <h2 className="royal-auth-title">Begin Your Royal Journey</h2>
            <p className="royal-auth-subtitle">Create New Password</p>
            <div className="royal-divider">
              <span className="royal-divider-ornament">
                <FaCrown style={{ fontSize: "0.8rem", verticalAlign: "middle" }} />
              </span>
            </div>
          </div>

          <div className="royal-auth-body">
            <form onSubmit={handleSubmit}>
              <div className="royal-form-group">
                <label htmlFor="password" className="royal-input-label">
                  New Password
                </label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="royal-input"
                  />
                  <div className="royal-password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
                {errors.password && (
                  <span className="royal-error-text">{errors.password}</span>
                )}
              </div>

              <div className="royal-form-group">
                <label htmlFor="newpassword" className="royal-input-label">
                  Confirm Password
                </label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="newpassword"
                    name="newpassword"
                    value={formData.newpassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="royal-input"
                  />
                  <div className="royal-password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
                {errors.newpassword && (
                  <span className="royal-error-text">{errors.newpassword}</span>
                )}
              </div>

              <button type="submit" className="royal-submit-btn">
                <FaHeart className="royal-submit-btn-icon" />
                Reset Password
              </button>
            </form>

            <p className="royal-footer-text">
              Verification failed? 
              <Link to="/forgot-password" className="royal-footer-link">
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
