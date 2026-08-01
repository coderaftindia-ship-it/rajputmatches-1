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


function Register() {
 
  return (
    <>
      <Profilenavbar />
      sdfg
     
    </>
  );
}

export default Register;
