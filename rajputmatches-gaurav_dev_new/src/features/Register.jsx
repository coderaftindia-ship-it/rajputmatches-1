import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { 
  FaRegEye, 
  FaRegEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaHeart, 
  FaCrown,
  FaUser,
  FaPhoneAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers
} from "react-icons/fa";
import { useAuth } from "../component/Layout/AuthContext";
import { authApi } from "../api/auth.api";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import royalPlaceBg from "../assets/images/royalplacebg.jpg";
import "./Login.css";

// Safe getter for Country list to prevent top-level module evaluation crashes on WebKit/Safari
const getSafeCountries = () => {
  try {
    const raw = Country.getAllCountries() || [];
    const popularIso = ["IN", "US", "AE", "GB", "CA", "AU", "SA", "SG", "KW", "QA", "OM"];
    const popular = raw.filter((c) => popularIso.includes(c.isoCode));
    const other = raw.filter((c) => !popularIso.includes(c.isoCode));
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
  const { register, message, email: authEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ALL_COUNTRIES = useMemo(() => getSafeCountries(), []);

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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Sync state options when country changes
  useEffect(() => {
    if (formData.country) {
      try {
        const raw = Country.getAllCountries() || [];
        const selectedCountry = raw.find((c) => c.name === formData.country);
        if (selectedCountry) {
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
  }, [formData.country]);

  // Sync city options when state changes (capped at max 150 to guarantee smooth WebKit rendering on iOS/Android)
  useEffect(() => {
    if (formData.state && formData.country) {
      try {
        const raw = Country.getAllCountries() || [];
        const selectedCountry = raw.find((c) => c.name === formData.country);
        if (selectedCountry) {
          const fetchedStates = State.getStatesOfCountry(selectedCountry.isoCode) || [];
          const selectedState = fetchedStates.find((s) => s.name === formData.state);
          if (selectedState) {
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
  }, [formData.state, formData.country]);

  // Check URL params for verification status
  useEffect(() => {
    const verifiedParam = new URLSearchParams(location.search).get("verified");
    const storedEmail = localStorage.getItem("verifiedEmail");
    if (verifiedParam === "true" || storedEmail) {
      setOtpVerified(true);
      if (storedEmail) {
        setFormData((prev) => (prev.email === storedEmail ? prev : { ...prev, email: storedEmail }));
      }
    }
  }, [location.search]);

  // Input change handler (clean & non-blocking for iOS/Android keyboards)
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

    // Clear field error on change
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
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      if (selectedDate > minAgeDate) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verify()) {
      if (!otpVerified) {
        setErrors((prev) => ({ ...prev, email: "Please verify your email before registering." }));
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

  // OTP Handling
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

  const verifyOtpHandler = async () => {
    setOtpMessage("");
    if (!otp) {
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

  const isVerified = otpVerified || new URLSearchParams(location.search).get("verified") === "true";

  return (
    <>
      {/* <Profilenavbar /> */}
      hiiiiii
    </>
  );
}

export default Register;
