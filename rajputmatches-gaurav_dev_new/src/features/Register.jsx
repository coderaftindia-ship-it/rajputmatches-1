import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { 
  FaRegEye, 
  FaRegEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaHeart, 
  FaCrown 
} from "react-icons/fa";
import { useAuth } from "../component/Layout/AuthContext";
import { authApi } from "../api/auth.api";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import "./Login.css";

function Register() {
  const { register, message, email } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: email,
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    password: "",
    countryCode: "",
    profilefor: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "mobile"
          ? value.replace(/\s/g, "").slice(0, 14) // No spaces, max 14 digits
          : ["email", "password"].includes(name)
          ? value.replace(/\s/g, "") // No spaces for email & password
          : ["firstName", "lastName"].includes(name)
          ? value.replace(/\s/g, "") // No spaces for first & last name
          : value,
      ...(name === "country" ? { state: "", city: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));
  };

  const verify = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const stringRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^\d{6,14}$/;
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|aol|icloud)\.(com|co|in)$/;

    // Name Validation (allows spaces)
    if (!formData.firstName.trim() || !nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Valid First Name is required.";
    }

    if (!formData.lastName.trim() || !nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Valid Last Name is required.";
    }

    if (!formData.profilefor.trim() || !stringRegex.test(formData.profilefor)) {
      newErrors.profilefor = "Valid profile for is required.";
    }

    // Mobile Validation (no spaces allowed)
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be a valid number.";
    }

    // Email Validation (no spaces allowed)
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Email must be valid.";
    } else if (/\s/.test(formData.email)) {
      newErrors.email = "Email should not contain spaces.";
    }

    // Date of Birth Validation
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required.";
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (selectedDate > today) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
      } else if (selectedDate > minDate) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
      }
    }

    // Other Required Fields
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country Code is required.";
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    // Password Validation (no spaces allowed)
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (/\s/.test(formData.password)) {
      newErrors.password = "Password should not contain spaces.";
    }

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verify()) {
      if (!otpVerified) {
        setErrors((prev) => ({ ...prev, email: "Please verify your email before signing up." }));
        return;
      }
      try {
        console.log("Submitting form:", formData);
        let response = await register("signup", formData, navigate);

        if (response && response.success) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const sendOtp = async () => {
    setOtpMessage("");
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required to send OTP." }));
      return;
    }
    try {
      setResendDisabled(true);
      const res = await authApi.sendVerification({ email: formData.email });
      if (res && res.data && res.data.success !== false) {
        setOtpSent(true);
        setOtpMessage(res.data.message || "OTP sent to your email.");
        // enable resend after 30s
        setTimeout(() => setResendDisabled(false), 30000);
      } else {
        setOtpMessage(res.data?.message || "Failed to send OTP.");
        setResendDisabled(false);
      }
    } catch (err) {
      console.error(err);
      setOtpMessage(err.response?.data?.message || "Server error sending OTP.");
      setResendDisabled(false);
    }
  };

  const verifyOtpHandler = async () => {
    setOtpMessage("");
    if (!otp) {
      setOtpMessage("Please enter the OTP.");
      return;
    }
    try {
      const res = await authApi.verifyOtp({ email: formData.email, otp });
      if (res && res.data && res.data.success) {
        setOtpVerified(true);
        setOtpMessage(res.data.message || "OTP verified successfully.");
      } else {
        setOtpMessage(res.data?.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setOtpMessage(err.response?.data?.message || "Server error verifying OTP.");
    }
  };

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(
        (c) => c.name === formData.country
      );
      if (selectedCountry) {
        setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find((s) => s.name === formData.state);
      if (selectedState) {
        setCities(
          City.getCitiesOfState(
            selectedState.countryCode,
            selectedState.isoCode
          )
        );
      }
    } else {
      setCities([]);
    }
  }, [formData.state, states]);

  useEffect(() => {
    // If email was verified via OTP page, prefill and mark as verified
    const verified = new URLSearchParams(window.location.search).get("verified");
    const stored = localStorage.getItem("verifiedEmail");
    if (verified === "true" && stored) {
      setFormData((prev) => ({ ...prev, email: stored }));
      setOtpVerified(true);
    }
  }, []);

  return (
    <>
      <Profilenavbar />
      <div className="royal-auth-container">
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

            <form onSubmit={handleSubmit}>
              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">First Name</label>
                  <div className="royal-input-wrapper">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      className="royal-input no-icon"
                    />
                  </div>
                  {errors.firstName && (
                    <span className="royal-error-text">{errors.firstName}</span>
                  )}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Last Name</label>
                  <div className="royal-input-wrapper">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                      className="royal-input no-icon"
                    />
                  </div>
                  {errors.lastName && (
                    <span className="royal-error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Mobile</label>
                  <div className="royal-otp-wrapper">
                    <select
                      className="royal-input no-icon"
                      style={{ width: "110px" }}
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="+91">+91</option>
                      <option value="+1">+1 (USA, Canada)</option>
                      <option value="+7">+7 (Russia, Kazakhstan)</option>
                      <option value="+20">+20 (Egypt)</option>
                      <option value="+27">+27 (South Africa)</option>
                      <option value="+30">+30 (Greece)</option>
                      <option value="+31">+31 (Netherlands)</option>
                      <option value="+32">+32 (Belgium)</option>
                      <option value="+33">+33 (France)</option>
                      <option value="+34">+34 (Spain)</option>
                      <option value="+39">+39 (Italy)</option>
                      <option value="+40">+40 (Romania)</option>
                      <option value="+41">+41 (Switzerland)</option>
                      <option value="+44">+44 (United Kingdom)</option>
                      <option value="+49">+49 (Germany)</option>
                      <option value="+51">+51 (Peru)</option>
                      <option value="+52">+52 (Mexico)</option>
                      <option value="+55">+55 (Brazil)</option>
                      <option value="+56">+56 (Chile)</option>
                      <option value="+60">+60 (Malaysia)</option>
                      <option value="+61">+61 (Australia)</option>
                      <option value="+62">+62 (Indonesia)</option>
                      <option value="+63">+63 (Philippines)</option>
                      <option value="+64">+64 (New Zealand)</option>
                      <option value="+65">+65 (Singapore)</option>
                      <option value="+66">+66 (Thailand)</option>
                      <option value="+81">+81 (Japan)</option>
                      <option value="+82">+82 (South Korea)</option>
                      <option value="+84">+84 (Vietnam)</option>
                      <option value="+86">+86 (China)</option>
                      <option value="+90">+90 (Turkey)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+92">+92 (Pakistan)</option>
                      <option value="+93">+93 (Afghanistan)</option>
                      <option value="+94">+94 (Sri Lanka)</option>
                      <option value="+95">+95 (Myanmar)</option>
                      <option value="+98">+98 (Iran)</option>
                      <option value="+212">+212 (Morocco)</option>
                      <option value="+216">+216 (Tunisia)</option>
                      <option value="+218">+218 (Libya)</option>
                      <option value="+220">+220 (Gambia)</option>
                      <option value="+221">+221 (Senegal)</option>
                      <option value="+222">+222 (Mauritania)</option>
                      <option value="+223">+223 (Mali)</option>
                      <option value="+224">+224 (Guinea)</option>
                      <option value="+225">+225 (Ivory Coast)</option>
                      <option value="+226">+226 (Burkina Faso)</option>
                      <option value="+227">+227 (Niger)</option>
                      <option value="+228">+228 (Togo)</option>
                      <option value="+229">+229 (Benin)</option>
                      <option value="+230">+230 (Mauritius)</option>
                      <option value="+231">+231 (Liberia)</option>
                      <option value="+232">+232 (Sierra Leone)</option>
                      <option value="+233">+233 (Ghana)</option>
                      <option value="+234">+234 (Nigeria)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+972">+972 (Israel)</option>
                      <option value="+973">+973 (Bahrain)</option>
                      <option value="+974">+974 (Qatar)</option>
                      <option value="+975">+975 (Bhutan)</option>
                      <option value="+976">+976 (Mongolia)</option>
                      <option value="+977">+977 (Nepal)</option>
                      <option value="+992">+992 (Tajikistan)</option>
                      <option value="+993">+993 (Turkmenistan)</option>
                      <option value="+994">+994 (Azerbaijan)</option>
                      <option value="+995">+995 (Georgia)</option>
                      <option value="+996">+996 (Kyrgyzstan)</option>
                      <option value="+998">+998 (Uzbekistan)</option>
                    </select>

                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter Mobile"
                      className="royal-input no-icon"
                    />
                  </div>
                  {errors.mobile && <span className="royal-error-text">{errors.mobile}</span>}
                  {errors.countryCode && (
                    <span className="royal-error-text">{errors.countryCode}</span>
                  )}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Email</label>
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
                  
                  {/* Inline verification handler in case email changes or OTP is needed */}
                  {!otpVerified && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                      <button type="button" className="royal-submit-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={sendOtp} disabled={resendDisabled}>
                        {otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                      {otpSent && (
                        <>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                            className="royal-input no-icon"
                            style={{ width: 100, padding: "6px" }}
                          />
                          <button type="button" className="royal-submit-btn" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={verifyOtpHandler}>
                            Verify
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {otpVerified && <span className="royal-info-text" style={{ color: "green", display: "block", textAlign: "left" }}>✓ Email verified</span>}
                  {otpMessage && <p className="royal-info-text" style={{ textAlign: "left" }}>{otpMessage}</p>}
                </div>
              </div>

              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Date of Birth</label>
                  <div className="royal-input-wrapper">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <span className="royal-error-text">{errors.dateOfBirth}</span>
                  )}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">Gender</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  {errors.gender && <span className="royal-error-text">{errors.gender}</span>}
                </div>
              </div>

              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">Country</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && (
                    <span className="royal-error-text">{errors.country}</span>
                  )}
                </div>

                <div className="royal-form-group">
                  <label className="royal-input-label">State</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="royal-input no-icon"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <span className="royal-error-text">{errors.state}</span>}
                </div>
              </div>

              <div className="royal-form-grid">
                <div className="royal-form-group">
                  <label className="royal-input-label">City</label>
                  <div className="royal-input-wrapper">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="royal-input no-icon"
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
                  <label className="royal-input-label">Profile is for whom?</label>
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
                  {errors.profilefor && (
                    <span className="royal-error-text">{errors.profilefor}</span>
                  )}
                </div>
              </div>

              <div className="royal-form-group">
                <label className="royal-input-label">Password</label>
                <div className="royal-input-wrapper">
                  <FaLock className="royal-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="royal-input"
                    autoComplete="new-password"
                  />
                  <div className="royal-password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </div>
                </div>
                {errors.password && (
                  <span className="royal-error-text">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="royal-submit-btn" style={{ marginTop: "1rem" }} onClick={handleSubmit}>
                <FaHeart className="royal-submit-btn-icon" />
                Register to Your Account
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

export default Register;
