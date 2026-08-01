import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Country, State, City } from "country-state-city";
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
import "./Login.css";

// 1. Storage Wrapper - Guarantees 100% safety on iOS Safari Private Browsing mode
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

// 2. Safe Static Getter for Country Data outside component execution scope
const getSafeCountries = () => {
  try {
    if (!Country || typeof Country.getAllCountries !== "function") return [];
    const raw = Country.getAllCountries() || [];
    const popularIso = ["IN", "US", "AE", "GB", "CA", "AU", "SA", "SG", "KW", "QA", "OM"];
    const popular = raw.filter((c) => c && c.isoCode && popularIso.includes(c.isoCode));
    const other = raw.filter((c) => c && c.isoCode && !popularIso.includes(c.isoCode));
    return [...popular, ...other];
  } catch (e) {
    return [];
  }
};

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

function Register() {
  const { register, email: authEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Static country array memoized once
  const countries = useMemo(() => getSafeCountries(), []);

  const [showPassword, setShowPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Form State with all 11 required fields
  const [formData, setFormData] = useState({
    firstName: "",
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

  // Refs prevent re-fetching location data on every single input keypress
  const prevCountryRef = useRef(formData.country);
  const prevStateRef = useRef(formData.state);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Populate initial state dropdown options once for default country ("India")
  useEffect(() => {
    if (formData.country && states.length === 0) {
      try {
        const selectedCountry = (countries || []).find((c) => c?.name === formData.country);
        if (selectedCountry?.isoCode) {
          const fetchedStates = State.getStatesOfCountry(selectedCountry.isoCode) || [];
          setStates(fetchedStates);
        }
      } catch (e) {}
    }
  }, [formData.country, countries, states.length]);

  // Update states ONLY when selected country changes
  useEffect(() => {
    if (prevCountryRef.current !== formData.country) {
      prevCountryRef.current = formData.country;
      if (formData.country) {
        try {
          const selectedCountry = (countries || []).find((c) => c?.name === formData.country);
          if (selectedCountry?.isoCode) {
            const fetchedStates = State.getStatesOfCountry(selectedCountry.isoCode);
            setStates(fetchedStates || []);
          } else {
            setStates([]);
          }
        } catch (e) {
          setStates([]);
        }
      } else {
        setStates([]);
      }
    }
  }, [formData.country, countries]);

  // Update cities ONLY when selected state changes (capped at 150 for mobile WebKit rendering)
  useEffect(() => {
    if (prevStateRef.current !== formData.state) {
      prevStateRef.current = formData.state;
      if (formData.state && formData.country) {
        try {
          const selectedCountry = (countries || []).find((c) => c?.name === formData.country);
          if (selectedCountry?.isoCode) {
            const fetchedStates = State.getStatesOfCountry(selectedCountry.isoCode) || [];
            const selectedState = fetchedStates.find((s) => s?.name === formData.state);
            if (selectedState?.isoCode) {
              const fetchedCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) || [];
              setCities(fetchedCities.slice(0, 150));
            } else {
              setCities([]);
            }
          } else {
            setCities([]);
          }
        } catch (e) {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    }
  }, [formData.state, formData.country, countries]);

  // Safe check for URL params or localStorage verification status (iOS Private Browsing protected)
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

  // Non-blocking input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (name === "email" || name === "password") {
      updatedValue = value.trim();
    } else if (name === "firstName" || name === "lastName") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
      ...(name === "country" ? { state: "", city: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Comprehensive Form Validation
  const verify = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    const mobileRegex = /^\d{6,14}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. First Name
    if (!formData.firstName.trim() || !nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = "Please enter a valid First Name.";
    }

    // 2. Last Name
    if (!formData.lastName.trim() || !nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = "Please enter a valid Last Name.";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verify()) {
      if (!isVerified) {
        setErrors((prev) => ({ ...prev, email: "Please verify your email before signing up." }));
        return;
      }
      try {
        let response = await register("signup", formData, navigate);
        if (response && response.success) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  // OTP Request Handler
  const sendOtp = async () => {
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
  };

  // OTP Verification Handler
  const verifyOtpHandler = async () => {
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
  };

  const isVerified = useMemo(() => {
    try {
      const searchStr = location?.search || (typeof window !== "undefined" ? window.location.search : "");
      return otpVerified || new URLSearchParams(searchStr).get("verified") === "true";
    } catch (e) {
      return otpVerified;
    }
  }, [otpVerified, location?.search]);

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
              <FaCrown className="royal-crown-icon" />
            </div>
            <h2 className="royal-auth-title">Begin Your Royal Journey</h2>
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

            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1: First Name & Last Name */}
              <div className="royal-form-grid">
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
                  <label className="royal-input-label">Last Name *</label>
                  <div className="royal-input-wrapper">
                    <FaUser className="royal-input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
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
                      {countries.map((country) => (
                        <option key={country.isoCode || country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && <span className="royal-error-text">{errors.country}</span>}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">State *</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="royal-input no-icon"
                      disabled={!formData.country}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode || state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <span className="royal-error-text">{errors.state}</span>}
                </div>
              </div>

              {/* Row 5: City & Profile For */}
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">City *</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="royal-input no-icon"
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
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

              {/* Register Button */}
              <button type="submit" className="royal-submit-btn">
                <FaHeart className="royal-submit-btn-icon" />
                Register Account
              </button>
            </form>

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
