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
  FaUser
} from "react-icons/fa";
import { useAuth } from "../component/Layout/AuthContext";
import { authApi } from "../api/auth.api";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import royalPlaceBg from "../assets/images/royalplacebg.jpg";
import "./Login.css";

// Safe getter for Country list outside component to prevent module re-evaluation call stack issues
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
 
  return (
    <>
      {/* <Profilenavbar /> */}
    hiiii
    </>
  );
}

export default Register;
