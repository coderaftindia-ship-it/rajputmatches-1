import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import Profilenavbar from "../component/Profile/ProfileComp/Profilenavbar";
import logoFallback from "../assets/images/logowhite.png";
import { authApi, isSuccessResponse } from "../api";
import { useSiteSettings } from "../context/SiteSettingsContext";

function VerifyEmail() {
  const { siteSettings } = useSiteSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmail = async () => {
    if (!token) {
      toast.error("Invalid verification link!", { position: "top-center" });
      return;
    }

    try {
      const response = await authApi.verifyEmail(token);

      if (isSuccessResponse(response)) {
        toast.success("Email verified successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Try again.", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/auth/emailverification");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  return (
    <>
      <Profilenavbar />
      <div className="forgot-password-page">
        <div className="overlay"></div>
        <div className="forgot-password-container">
          <div className="title mt-0">
            <img
              src={siteSettings.logo || logoFallback}
              alt={siteSettings.companyName || "Logo"}
              onError={(e) => { e.target.onerror = null; e.target.src = logoFallback; }}
              className="rounded-full border-4 border-white"
              style={{ objectFit: "cover" }}
            />
          </div>
          <p className="subtitle">Welcome! Email is Verified</p>
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
