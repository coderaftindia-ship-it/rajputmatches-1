import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./component/Layout/Navbar";
import Banner from "./component/Layout/Banner";
import Features from "./component/Layout/Features";
import About from "./component/Layout/About";
import Login from "./features/login";
import Register from "./features/Register";
import ForgotPassword from "./features/ForgetPassword";
import Profile from "./component/Profile/ProfileComp/Profile";
import Mydetails from "./component/Profile/BasicDetails/Mydetails";
import ProtectedRoute from "./component/Layout/ProtectedRoute";
import { AuthProvider } from "./component/Layout/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import Profilenavbar from "./component/Profile/ProfileComp/Profilenavbar";
import Settings from "./component/Profile/ProfileComp/Settings";
import SearchPage from "./component/Layout/SearchPage";
import Home from "./component/Layout/Home";
import NewPassword from "./features/NewPassword";
import Stories from "./component/Layout/Stories";
import ContactUs from "./component/Layout/ContactUs";
import HowToUse from "./component/Layout/HowToUse";
import NotFoundPage from "./component/Layout/NotFoundPage";
import ChatApp from "./component/Layout/ChatApp";
import Verification from "./features/Verification";
import VerifyEmail from "./features/VerifyEmail";
import EmailOtpVerify from "./features/EmailOtpVerify";
import BottomNav from "./component/Layout/BottomNav";
import PrivacyPolicy from "./component/Layout/PrivacyPolicy";
import TermsOfUse from "./component/Layout/TermsOfUse";
import ReportFeedbackWidget from "./component/Layout/ReportFeedbackWidget";

import ViewImages from "./component/Profile/Forms/ViewImages";
import ViewPage from "./component/Profile/Forms/ViewPage";
import Dashboard from "./component/Layout/Dashboard";

import { ToastContainer } from "react-toastify";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTelegram } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BASE_URL = (process.env.REACT_APP_BASE_URL || process.env.VITE_APP_BASE_URL || "https://rajputana-backend-matrimonial-7tmmtqu5u-test166.vercel.app").replace(/\/$/, "");

function FloatingSocial() {
  const [links, setLinks] = useState({
    facebook: "#",
    instagram: "#",
    whatsapp: "#",
    telegram: "#",
  });

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/auth/social-links`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.links) {
          setLinks(data.links);
        }
      })
      .catch(() => {});
  }, []);

  const socialConfig = [
    { icon: <FaFacebook size={18} />, label: "Facebook",  key: "facebook",  color: "#1877F2" },
    { icon: <FaInstagram size={18} />, label: "Instagram", key: "instagram", color: "#E1306C" },
    { icon: <FaWhatsapp size={18} />, label: "WhatsApp",  key: "whatsapp",  color: "#25D366" },
    { icon: <FaTelegram size={18} />, label: "Telegram",  key: "telegram",  color: "#0088cc" },
  ];

  const activeLinks = socialConfig
    .map((item) => ({ ...item, href: links[item.key] || "#" }))
    .filter((item) => item.href && item.href !== "");

  if (activeLinks.length === 0) return null;

  return (
    <div className="floating-social-sidebar">
      {activeLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            background: "var(--royal-maroon-dark)",
            border: "1.5px solid var(--royal-gold)",
            borderLeft: "none",
            color: "var(--royal-gold)",
            transition: "all 0.25s ease",
            textDecoration: "none",
            borderRadius: "0 8px 8px 0",
            marginBottom: "4px",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = s.color;
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = s.color;
            e.currentTarget.style.transform = "translateX(6px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--royal-maroon-dark)";
            e.currentTarget.style.color = "var(--royal-gold)";
            e.currentTarget.style.borderColor = "var(--royal-gold)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

// Har route change par page top pe scroll karo
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
      {/* ToastContainer for displaying toast notifications */}
      <ToastContainer
        position="bottom-left" // Position of the toast
        autoClose={1000} // Auto-close after 3 seconds
        hideProgressBar={false} // Show the progress bar
        newestOnTop={false} // Toasts are not stacked newest on top
        closeOnClick // Close on click
        pauseOnHover // Pause auto-close on hover
        draggable // Enable drag-and-drop
        theme="light" // Light theme
      />

      <ScrollToTop />
      <FloatingSocial />
      <ReportFeedbackWidget />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
     <Route path="login" element={<Login />} />
         {/* <Route path="signup" element={<Register />} /> */}
        {/* <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="set-new-password" element={<NewPassword />} />
        <Route path="auth/emailverification" element={<Verification />} />
        <Route path="auth/otp-verify" element={<EmailOtpVerify />} />
        <Route path="verify-email" element={<VerifyEmail />} />  */}

        <Route path="about" element={<About />} />
        {/* <Route path="stories" element={<Stories />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="how-to-use" element={<HowToUse />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-use" element={<TermsOfUse />} />

       
        <Route path="*" element={<NotFoundPage />} />

      
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >
          <Route index element={<Mydetails />} />
        </Route>
        <Route
          path="message"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/view/:profileId"
          element={
            <ProtectedRoute>
              <ViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="search/view/:profileId"
          element={
            <ProtectedRoute>
              <ViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="search/view/images/:profileId"
          element={
            <ProtectedRoute>
              <ViewImages />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/view/images/:profileId"
          element={
            <ProtectedRoute>
              <ViewImages />
            </ProtectedRoute>
          }
        />    */}
      </Routes>
      <BottomNav />
    </AuthProvider>
    </SiteSettingsProvider>
  );
}

export default App;
