import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaRegEye, 
  FaRegEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaHeart, 
  FaCrown,
  FaUser
} from "react-icons/fa";
import { useAuth } from "../component/Layout/AuthContext";
import { authApi } from "../api/auth.api";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import royalPlaceBg from "../assets/images/royalplacebg.jpg";
import indiaStatesData from "./state";
import { useSiteSettings } from "../context/SiteSettingsContext";
import "./Login.css";

/* ─── 1. Storage Wrapper (iOS Safari Private Browsing Guard) ───── */
const safeStorage = {
  getItem: (key) => {
    try {
      return typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {}
  },
};

/* ─── 2. High-Performance Static Country List (Webkit Call Stack Safe) ─── */
const POPULAR_COUNTRIES = [
  "India",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Canada",
  "Australia",
  "Saudi Arabia",
  "Singapore",
  "Kuwait",
  "Qatar",
  "Oman",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Japan",
  "China",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "Bangladesh",
  "Malaysia",
  "New Zealand",
  "South Africa",
  "Netherlands",
  "Sweden",
  "Switzerland",
  "Norway",
  "Denmark",
  "Ireland",
  "Bahrain"
];

/* ─── 3. Static Country Dial Codes ─────────────────────────────── */
const COUNTRY_CODES = [
  { code: "+91", label: "+91 (India)" },
  { code: "+1", label: "+1 (USA/Canada)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+965", label: "+965 (Kuwait)" },
  { code: "+974", label: "+974 (Qatar)" },
  { code: "+968", label: "+968 (Oman)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
  { code: "+39", label: "+39 (Italy)" },
  { code: "+34", label: "+34 (Spain)" },
  { code: "+81", label: "+81 (Japan)" },
  { code: "+86", label: "+86 (China)" },
  { code: "+92", label: "+92 (Pakistan)" },
  { code: "+977", label: "+977 (Nepal)" },
  { code: "+94", label: "+94 (Sri Lanka)" },
  { code: "+880", label: "+880 (Bangladesh)" }
];

/* ─── 4. Normalize Indian State Map for Fast Lookups ───────────── */
const formattedStateMap = (() => {
  const map = {};
  if (indiaStatesData && typeof indiaStatesData === "object") {
    Object.keys(indiaStatesData).forEach((key) => {
      // Convert camel/pascal case keys to human readable labels (e.g. UttarPradesh -> Uttar Pradesh)
      const readableName = key.replace(/([A-Z])/g, " $1").trim();
      map[readableName] = indiaStatesData[key] || [];
      // Also map exact key
      map[key] = indiaStatesData[key] || [];
    });
  }
  // Ensure default common state aliases
  map["Uttar Pradesh"] = map["UttarPradesh"] || map["Uttar Pradesh"] || [];
  map["Madhya Pradesh"] = map["MadhyaPradesh"] || map["Madhya Pradesh"] || [];
  map["West Bengal"] = map["WestBengal"] || map["West Bengal"] || [];
  map["Tamil Nadu"] = map["TamilNadu"] || map["Tamil Nadu"] || [];
  map["Andhra Pradesh"] = map["AndhraPradesh"] || map["Andhra Pradesh"] || [];
  return map;
})();

const INDIAN_STATES_LIST = Object.keys(formattedStateMap).filter(
  (s) => !s.match(/^[a-z]/) && !["UttarPradesh", "MadhyaPradesh", "WestBengal", "TamilNadu", "AndhraPradesh"].includes(s)
).sort();

/* ─── 5. Main Register Component ───────────────────────────────── */
function Register() {
  const { register, email: authEmail } = useAuth();
  const { siteSettings } = useSiteSettings();
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Form State with all required fields
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    countryCode: "+91",
    mobile: "",
    email: authEmail || "",
    dateOfBirth: "",
    gender: "",
    country: "India",
    state: "",
    city: "",
    profilefor: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Compute available states based on selected country (Zero call stack overhead)
  const availableStates = useMemo(() => {
    if (formData.country === "India") {
      return INDIAN_STATES_LIST;
    }
    return [];
  }, [formData.country]);

  // Compute available cities based on selected state (Zero call stack overhead)
  const availableCities = useMemo(() => {
    if (formData.country === "India" && formData.state) {
      const cityList = formattedStateMap[formData.state] || [];
      return cityList;
    }
    return [];
  }, [formData.country, formData.state]);

  // Safe check for URL search params or localStorage verification status
  useEffect(() => {
    try {
      const searchStr = location?.search || (typeof window !== "undefined" ? window.location.search : "");
      const verifiedParam = new URLSearchParams(searchStr).get("verified");
      const storedEmail = safeStorage.getItem("verifiedEmail");
      if (verifiedParam === "true" || storedEmail) {
        setOtpVerified(true);
        if (storedEmail) {
          setFormData((prev) => (prev.email === storedEmail ? prev : { ...prev, email: storedEmail }));
        }
      }
    } catch (e) {}
  }, [location?.search]);

  // Non-blocking Input Change Handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (name === "email" || name === "password") {
      updatedValue = value.trim();
    } else if (name === "firstName" || name === "middleName" || name === "lastName") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
      ...(name === "country" ? { state: "", city: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));

    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  // Validation Engine
  const verify = useCallback(() => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    const mobileRegex = /^\d{6,14}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. First Name
    if (!formData.firstName.trim() || !nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = "Please enter a valid First Name.";
    }

    // 2. Middle Name (Optional)
    if (formData.middleName && formData.middleName.trim() && !nameRegex.test(formData.middleName.trim())) {
      newErrors.middleName = "Please enter a valid Middle Name.";
    }

    // 3. Last Name / Sub-clan
    if (!formData.lastName.trim() || !nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = "Please enter a valid Last Name / Sub-clan.";
    }

    // 3. Country Code
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Code required.";
    }

    // 4. Mobile Number
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid mobile number.";
    }

    // 5. Email
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 6. Date of Birth
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required.";
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dateOfBirth = "Please enter a valid date of birth.";
      } else {
        const today = new Date();
        const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        if (selectedDate > minAgeDate) {
          newErrors.dateOfBirth = "You must be at least 18 years old.";
        }
      }
    }

    // 7. Gender
    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required.";
    }

    // 8. Country
    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    // 9. State
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    // 10. City
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    // 11. Profile For
    if (!formData.profilefor.trim()) {
      newErrors.profilefor = "Please select who this profile is for.";
    }

    // 12. Password
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // 13. Terms & Conditions
    if (!agreeTerms) {
      newErrors.agreeTerms = "Please agree to the Terms of Use & Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, agreeTerms]);

  const isVerified = useMemo(() => {
    try {
      const searchStr = location?.search || (typeof window !== "undefined" ? window.location.search : "");
      return otpVerified || new URLSearchParams(searchStr).get("verified") === "true";
    } catch (e) {
      return otpVerified;
    }
  }, [otpVerified, location?.search]);

  // Form Submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (verify()) {
      if (!isVerified) {
        setErrors((prev) => ({ ...prev, email: "Please verify your email before signing up." }));
        return;
      }
      try {
        let response = await register("signup", formData, navigate);
        if (response && response.success) {
          setRegistrationComplete(true);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  }, [verify, isVerified, register, formData, navigate]);

  // OTP Sending Handler
  const sendOtp = useCallback(async () => {
    setOtpMessage("");
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required to send OTP." }));
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      return;
    }
    try {
      setResendDisabled(true);
      const res = await authApi.sendVerification({ email: formData.email });
      if (res && res.data && res.data.success !== false) {
        setOtpSent(true);
        setOtpMessage(res.data.message || "OTP sent to your email address.");
        setTimeout(() => setResendDisabled(false), 30000);
      } else {
        setOtpMessage(res.data?.message || "Failed to send OTP. Please try again.");
        setResendDisabled(false);
      }
    } catch (err) {
      console.error(err);
      setOtpMessage(err.response?.data?.message || "Server error sending OTP.");
      setResendDisabled(false);
    }
  }, [formData.email]);

  // OTP Verification Handler
  const verifyOtpHandler = useCallback(async () => {
    setOtpMessage("");
    if (!otp || otp.length !== 6) {
      setOtpMessage("Please enter the 6-digit OTP.");
      return;
    }
    try {
      const res = await authApi.verifyOtp({ email: formData.email, otp });
      if (res && res.data && res.data.success) {
        setOtpVerified(true);
        setOtpMessage(res.data.message || "Email verified successfully!");
      } else {
        setOtpMessage(res.data?.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setOtpMessage(err.response?.data?.message || "Server error verifying OTP.");
    }
  }, [formData.email, otp]);

  return (
    <>
      <Profilenavbar />
      <div 
        className="royal-auth-container"
        style={
          isVerified
            ? {
                backgroundImage: `url(${royalPlaceBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        <div className="royal-auth-overlay"></div>
        <div className="royal-auth-card wide">
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
            <p className="royal-auth-subtitle">Join the Exclusive Rajput Network</p>
            <div className="royal-divider">
              <span className="royal-divider-ornament">
                <FaCrown style={{ fontSize: "0.8rem", verticalAlign: "middle" }} />
              </span>
            </div>
          </div>

          <div className="royal-auth-body">
            {/* Tab Navigation */}
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
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </div>

            {registrationComplete ? (
              <div style={{ textAlign: "center", padding: "20px 10px", animation: "fadeIn 0.5s ease-in-out" }}>
                <div 
                  style={{
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                    border: "1.5px solid var(--royal-gold, #d4af37)",
                    borderRadius: "16px",
                    padding: "28px 24px",
                    marginBottom: "24px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
                  }}
                >
                  <h3 style={{ color: "var(--royal-maroon, #8b0000)", fontFamily: "Cinzel, serif", fontWeight: "700", marginBottom: "14px", fontSize: "1.6rem" }}>
                    Khama Ghani, Hukum!
                  </h3>
                  <div className="royal-divider" style={{ marginBottom: "18px" }}>
                    <span className="royal-divider-ornament">
                      <FaCrown style={{ fontSize: "0.8rem", verticalAlign: "middle" }} />
                    </span>
                  </div>
                  <p style={{ color: "#333", fontSize: "1.05rem", lineHeight: "1.7", margin: "0 auto", fontWeight: "500" }}>
                    Thank you for registering with <strong>Rajput Alliances</strong>. We will verify your account and email you once it is approved, so you can log in and create your profile.
                  </p>
                </div>

                <button 
                  type="button" 
                  className="royal-submit-btn" 
                  onClick={() => navigate("/login")}
                  style={{ maxWidth: "260px", margin: "0 auto" }}
                >
                  Proceed to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
              {/* Row 1: First Name, Middle Name & Last Name / Sub-clan */}
              <div className="royal-form-grid-3">
                <div className="royal-form-group">
                  <label className="royal-input-label">First Name *</label>
                  <div className="royal-input-wrapper">
                    <FaUser className="royal-input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      className="royal-input"
                    />
                  </div>
                  {errors.firstName && <span className="royal-error-text">{errors.firstName}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Middle Name</label>
                  <div className="royal-input-wrapper">
                    <FaUser className="royal-input-icon" />
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Enter Middle Name"
                      className="royal-input"
                    />
                  </div>
                  {errors.middleName && <span className="royal-error-text">{errors.middleName}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Last Name / Sub-clan *</label>
                  <div className="royal-input-wrapper">
                    <FaUser className="royal-input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter Sub-clan / Last Name"
                      className="royal-input"
                    />
                  </div>
                  {errors.lastName && <span className="royal-error-text">{errors.lastName}</span>}
                </div>
              </div>

              {/* Row 2: Mobile & Email */}
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Mobile Number *</label>
                  <div className="royal-otp-wrapper">
                    <select
                      className="royal-input no-icon"
                      style={{ width: "105px", flexShrink: 0 }}
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter Mobile"
                      className="royal-input no-icon"
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                  {errors.mobile && <span className="royal-error-text">{errors.mobile}</span>}
                  {errors.countryCode && <span className="royal-error-text">{errors.countryCode}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Email Address *</label>
                  <div className="royal-input-wrapper">
                    <FaEnvelope className="royal-input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                      className="royal-input"
                      disabled={otpVerified}
                    />
                  </div>
                  {errors.email && <span className="royal-error-text">{errors.email}</span>}
                  
                  {!otpVerified && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <button 
                        type="button" 
                        className="royal-submit-btn" 
                        style={{ padding: "6px 14px", fontSize: "0.82rem", width: "auto" }} 
                        onClick={sendOtp} 
                        disabled={resendDisabled}
                      >
                        {otpSent ? "Resend OTP" : "Verify Email OTP"}
                      </button>
                      {otpSent && (
                        <div className="d-flex gap-2 align-items-center">
                          <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                            className="royal-input no-icon"
                            style={{ width: 110, padding: "6px 10px", fontSize: "0.85rem" }}
                          />
                          <button 
                            type="button" 
                            className="royal-submit-btn" 
                            style={{ padding: "6px 12px", fontSize: "0.82rem", width: "auto" }} 
                            onClick={verifyOtpHandler}
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {otpVerified && <span className="royal-info-text" style={{ color: "#2b8a3e", display: "block", textAlign: "left", fontWeight: "600" }}>✓ Email Verified</span>}
                  {otpMessage && <p className="royal-info-text" style={{ textAlign: "left", fontSize: "0.82rem" }}>{otpMessage}</p>}
                </div>
              </div>

              {/* Row 3: Date of Birth & Gender */}
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Date of Birth *</label>
                  <div className="royal-input-wrapper">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    />
                  </div>
                  {errors.dateOfBirth && <span className="royal-error-text">{errors.dateOfBirth}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Gender *</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male (Groom)</option>
                      <option value="Female">Female (Bride)</option>
                    </select>
                  </div>
                  {errors.gender && <span className="royal-error-text">{errors.gender}</span>}
                </div>
              </div>

              {/* Row 4: Country & State */}
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Country *</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select Country</option>
                      {POPULAR_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && <span className="royal-error-text">{errors.country}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">State *</label>
                  <div className="royal-input-wrapper">
                    {availableStates.length > 0 ? (
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="royal-input no-icon"
                      >
                        <option value="">Select State</option>
                        {availableStates.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter State"
                        className="royal-input no-icon"
                      />
                    )}
                  </div>
                  {errors.state && <span className="royal-error-text">{errors.state}</span>}
                </div>
              </div>

              {/* Row 5: City & Profile For */}
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">City *</label>
                  <div className="royal-input-wrapper">
                    {availableCities.length > 0 ? (
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="royal-input no-icon"
                      >
                        <option value="">Select City</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter City"
                        className="royal-input no-icon"
                      />
                    )}
                  </div>
                  {errors.city && <span className="royal-error-text">{errors.city}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Profile is for whom? *</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="profilefor"
                      value={formData.profilefor}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select Option</option>
                      <option value="Myself">Myself</option>
                      <option value="My Son">My Son</option>
                      <option value="My Daughter">My Daughter</option>
                      <option value="My Brother">My Brother</option>
                      <option value="My Sister">My Sister</option>
                      <option value="My Friend">My Friend</option>
                      <option value="My Relative">My Relative</option>
                    </select>
                  </div>
                  {errors.profilefor && <span className="royal-error-text">{errors.profilefor}</span>}
                </div>
              </div>

              {/* Row 6: Password */}
              <div className="royal-form-group mb-4">
                <label className="royal-input-label">Password *</label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter at least 6 characters"
                    className="royal-input"
                    autoComplete="new-password"
                  />
                  <div className="royal-password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
                {errors.password && <span className="royal-error-text">{errors.password}</span>}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "14px", marginBottom: "14px", fontSize: "0.88rem", color: "#4a3b32", textAlign: "left" }}>
                <input
                  type="checkbox"
                  id="registerAgreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: "var(--royal-maroon)", width: "16px", height: "16px", marginTop: "2px", cursor: "pointer" }}
                />
                <label htmlFor="registerAgreeTerms" style={{ cursor: "pointer", margin: 0, lineHeight: "1.4" }}>
                  I agree to the <Link to="/terms-of-use" target="_blank" style={{ color: "var(--royal-maroon)", fontWeight: "600", textDecoration: "underline" }}>Terms of Use</Link> & <Link to="/privacy-policy" target="_blank" style={{ color: "var(--royal-maroon)", fontWeight: "600", textDecoration: "underline" }}>Privacy Policy</Link> *
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="royal-error-text" style={{ display: "block", marginTop: "-6px", marginBottom: "14px", textAlign: "left" }}>{errors.agreeTerms}</span>
              )}

              {/* Register Button */}
              <button type="submit" className="royal-submit-btn">
                <FaHeart className="royal-submit-btn-icon" />
                Register Account
              </button>
            </form>
            )}

            <p className="royal-footer-text mt-4">
              Already have an account?{" "}
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

export default Register;
