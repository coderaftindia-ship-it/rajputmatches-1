import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import styles from "./ViewPage.module.css";
import Profilenavbar from "../ProfileComp/Profilenavbar";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaRulerVertical,
  FaWeight,
  FaHeart,
  FaMapMarkerAlt,
  FaUserCheck,
  FaIdCard,
  FaUser,
  FaStar,
  FaMoon,
  FaClock,
  FaMapMarkedAlt,
  FaSun,
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaBuilding,
  FaBriefcase,
  FaHome,
  FaUserFriends,
  FaPrint,
  FaShieldAlt,
  FaHandshake,
  FaLock,
  FaTimes,
  FaCopy,
  FaInfoCircle,
  FaFileAlt,
} from "react-icons/fa";

import { useAuth } from "../../Layout/AuthContext";
import { BASE_URL } from "../../../api";
import blurImage from "../../../assets/images/blurimage.png";
import maleDefault from "../../../assets/images/male_default.png";
import femaleDefault from "../../../assets/images/female_default.png";

// ─────────────────────────────────────────────────
// Media URL Helper (Safely format images & docs)
// ─────────────────────────────────────────────────
const getMediaUrl = (item) => {
  if (!item) return "";
  let raw = "";
  if (typeof item === "string") {
    raw = item;
  } else if (typeof item === "object") {
    raw = item.url || item.path || item.secure_url || item.filename || "";
  }
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  const cleanPath = raw.replace(/\\/g, "/");
  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${BASE_URL}${formattedPath}`;
};

// ─────────────────────────────────────────────────
// Scroll-reveal wrapper
// ─────────────────────────────────────────────────
// Scroll-reveal wrapper (Lightweight & fast)
// ─────────────────────────────────────────────────
const Reveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────────
// Fast list animations
// ─────────────────────────────────────────────────
const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } }
};

// ─────────────────────────────────────────────────
// Gold Dust Floating Spec System (Disabled for zero lag)
// ─────────────────────────────────────────────────
const GoldDust = () => null;

// ─────────────────────────────────────────────────
// Slowly Spinning Mandala SVG Watermark
// ─────────────────────────────────────────────────
const MandalaSVG = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.4"
    strokeLinecap="round"
  >
    <circle cx="50" cy="50" r="46" strokeDasharray="1 3" />
    <circle cx="50" cy="50" r="42" />
    <circle cx="50" cy="50" r="28" />
    <circle cx="50" cy="50" r="14" />
    <path d="M 50,4 L 50,96 M 4,50 L 96,50 M 17.5,17.5 L 82.5,82.5 M 17.5,82.5 L 82.5,17.5" />
    {/* Mandala Petals */}
    <path d="M 50,4 C 43,18 57,18 50,4 Z M 50,96 C 43,82 57,82 50,96 Z M 4,50 C 18,43 18,57 4,50 Z M 96,50 C 82,43 82,57 96,50 Z" />
    <path d="M 17.5,17.5 C 24,30 30,24 17.5,17.5 Z M 82.5,82.5 C 76,70 70,76 82.5,82.5 Z M 17.5,82.5 C 24,70 30,76 17.5,82.5 Z M 82.5,17.5 C 76,30 70,24 82.5,17.5 Z" />
  </svg>
);

// ─────────────────────────────────────────────────
// Section Ribbon header
// ─────────────────────────────────────────────────
const SectionRibbon = ({ children }) => (
  <div className={styles.sectionRibbon}>
    <span className={styles.ribbonOrn}>✦</span>
    <span>{children}</span>
  </div>
);

// ─────────────────────────────────────────────────
// Helper: properly format array fields in profdetailsId
// ─────────────────────────────────────────────────
const formatArrayValue = (key, val) => {
  if (!Array.isArray(val) || val.length === 0) return "N/A";
  if (key === "qualificationsList") {
    return val.map((item) => {
      const parts = [];
      if (item?.qualification) parts.push(item.qualification);
      if (item?.institution) parts.push(`(${item.institution})`);
      return parts.join(" ") || "N/A";
    }).filter(Boolean).join(", ") || "N/A";
  }
  if (key === "occupationsList") {
    return val.map((item) => {
      const parts = [];
      if (item?.occupation) parts.push(item.occupation);
      if (item?.salary) parts.push(`(${item.salary})`);
      return parts.join(" ") || "N/A";
    }).filter(Boolean).join(", ") || "N/A";
  }
  // generic string array (e.g. hobbies)
  return val.join(", ") || "N/A";
};

// ─────────────────────────────────────────────────
// A single detail row: circle icon + label + value
// ─────────────────────────────────────────────────
const DetailRow = ({ icon, label, value, isLockedContact, contactRequestStatus, onRequestAccess }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailIconCircle}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue} style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>{value || "N/A"}</div>
      {isLockedContact && (
        contactRequestStatus === "pending" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "10px", fontSize: "0.65rem", fontWeight: "600", backgroundColor: "#fffbeb", color: "#d97706", border: "1px solid #fef3c7", marginTop: "4px" }}>
            <FaClock size={9} /> Pending
          </span>
        ) : contactRequestStatus === "rejected" ? (
          <button
            className={styles.requestAccessBadge}
            onClick={(e) => { e.stopPropagation(); onRequestAccess(); }}
            title="Resend Contact Access Request"
            style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fee2e2", cursor: "pointer", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.65rem" }}
          >
            <FaTimes size={9} /> Resend
          </button>
        ) : (
          <button
            className={styles.requestAccessBadge}
            onClick={(e) => { e.stopPropagation(); onRequestAccess(); }}
            title="Request Contact Access"
            style={{ cursor: "pointer", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.65rem" }}
          >
            <FaLock size={9} /> Send Request
          </button>
        )
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────
const ViewPage = () => {
  const { fetchUserData, updateData, userData: authUserData } = useAuth();

  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const { profileId }                         = useParams();
  const navigate                              = useNavigate();
  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      const fallback = window.location.pathname.includes("/search") ? "/search" : "/profile";
      navigate(fallback);
    }
  };
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [currentIndexDoc, setCurrentIndexDoc] = useState(0);
  const [formData, setFormData]               = useState({});
  const [paternaldetails, setPaternaldetails] = useState({});
  const [Data, setData]                       = useState({});
  const [images, setImages]                   = useState([]);
  const [documents, setdocuments]             = useState([]);
  const [isaccepted, setisaccepted]           = useState(true);
  const [docReqLoading, setDocReqLoading]     = useState(false);

  // Tab State: "summary", "astro", "family", "documents"
  const [activeTab, setActiveTab]             = useState("summary");
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen]   = useState(false);
  const [lightboxIndex, setLightboxIndex]     = useState(0);

  // ── Fetch ──────────────────────────────────────
  const handleView = async () => {
    try {
      const route    = `profile/view/${profileId}`;
      const response = await fetchUserData(route);
      if (!response) { setLoading(false); return; }

      const formattedHeight = response.height
        ? `${response.height.feet} feet ${response.height.inches} inches`
        : "N/A";

      const profileData = Array.isArray(response)
        ? response[0] || {}
        : response || {};

      const formattedDateOfBirth = profileData.dateOfBirth
        ? new Date(profileData.dateOfBirth)
            .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
            .replace(/ /g, "-")
        : "N/A";

      setData(profileData);
      setImages(profileData?.filesId?.photos || []);
      setdocuments(profileData?.filesId?.documents || []);

      if (profileData?.paternaldetails) {
        setPaternaldetails(profileData?.paternaldetails);
      }

      setFormData({
        matrimonialid:  profileData.martrId || "N/A",
        lastName:       `${profileData.lastName || ""}`.trim(),
        dateOfBirth:    formattedDateOfBirth,
        mobile:         profileData.mobile || "N/A",
        email:          profileData.email || "N/A",
        height:         formattedHeight,
        weight:         profileData.weight || "N/A",
        maritalStatus:  profileData.maritalStatus || "N/A",
        address:        `${profileData.address?.city || ""}, ${profileData.address?.state || ""}, ${profileData.address?.country || ""}`.trim() || "N/A",
        profileFor:     profileData.profilefor || "N/A",
      });

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // ── Copy Profile Link ───────────────────────────
  const copyProfileLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast.success("Profile link copied to clipboard!");
  };

  // ── Send Interest / Request Details ─────────────
  const handleRequestDetails = async () => {
    try {
      const res = await updateData("profile/contactRequest", profileId, false);
      if (res) {
        toast.success("Access Request Sent! You will see details once they accept your request.");
        // Optimistically flip the button to Pending immediately
        setData((prev) => ({ ...prev, contactRequestStatus: "pending" }));
        handleView();
      }
    } catch (err) {
      toast.error("Failed to send request. Please try again.");
    }
  };

  const handlePhotoRequest = async () => {
    setDocReqLoading(true);
    try {
      const res = await updateData("profile/photoRequest", profileId, true);
      if (res) {
        toast.success("Photo Request Sent!");
        setData((prev) => ({ ...prev, photoRequestStatus: "pending" }));
        handleView();
      }
    } catch (err) {
      toast.error("Failed to send photo request.");
    } finally {
      setDocReqLoading(false);
    }
  };

  const handleDocumentRequest = async () => {
    setDocReqLoading(true);
    try {
      const res = await updateData("profile/documentRequest", profileId, true);
      if (res) {
        toast.success("Document Request Sent!");
        // Optimistically show Pending immediately
        setData((prev) => ({ ...prev, documentRequestStatus: "pending" }));
        handleView();
      }
    } catch (err) {
      toast.error("Failed to send document request.");
    } finally {
      setDocReqLoading(false);
    }
  };

  // ── Icon helpers ───────────────────────────────
  const keyNameMapping = {
    grandFatherName: "Grandfather Name",
    grandFathersonOf: "Son of",
    grandFatheroccupation: "Occupation",
    grandFatherthikana: "Address",
    grandMotherName: "GrandMother Name",
    grandMotherdaughterOf: "Daughter of",
    grandmotherthikana: "Address",
    maternalGrandFatherName: "Maternal Grandfather",
    maternalGrandFathersonOf: "Son of",
    maternalGrandFatheroccupation: "Occupation",
    maternalGrandFatherthikana: "Address",
    maternalGrandMotherName: "Maternal Grandmother",
    maternalGrandMotherdaughterOf: "Daughter of",
    maternalGrandMotherthikana: "Address",
  };

  const basicDetailsConfig = {
    matrimonialid: { label: "Matrimonial ID",       icon: <FaIdCard /> },
    lastName:      { label: "Last Name",             icon: <FaUser /> },
    dateOfBirth:   { label: "Date of Birth",         icon: <FaCalendarAlt /> },
    mobile:        { label: "Mobile Number",          icon: <FaPhoneAlt /> },
    email:         { label: "Email Address",          icon: <FaEnvelope /> },
    height:        { label: "Height",                 icon: <FaRulerVertical /> },
    weight:        { label: "Weight",                 icon: <FaWeight /> },
    maritalStatus: { label: "Marital Status",         icon: <FaHeart /> },
    address:       { label: "Current Address",        icon: <FaMapMarkerAlt /> },
    profileFor:    { label: "Profile Created For",    icon: <FaUserCheck /> },
  };

  const getHoroscopeIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes("birth") || k.includes("place")) return <FaMapMarkedAlt />;
    if (k.includes("time"))                           return <FaClock />;
    if (k.includes("rasi") || k.includes("sign"))     return <FaStar />;
    if (k.includes("nakshatra") || k.includes("moon"))return <FaMoon />;
    if (k.includes("gotra"))                          return <FaUsers />;
    if (k.includes("manglik"))                        return <FaSun />;
    return <FaStar />;
  };

  const getEducationIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes("education") || k.includes("degree") || k.includes("qual")) return <FaGraduationCap />;
    if (k.includes("income") || k.includes("salary"))                           return <FaDollarSign />;
    if (k.includes("organization") || k.includes("company") || k.includes("work")) return <FaBuilding />;
    return <FaBriefcase />;
  };

  const getFamilyIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes("father")) return <FaUser />;
    if (k.includes("mother")) return <FaUser />;
    if (k.includes("sibling") || k.includes("brother") || k.includes("sister")) return <FaUserFriends />;
    return <FaHome />;
  };

  // ── Carousel helpers ───────────────────────────
  const prevSlide    = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextSlide    = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  const prevDocSlide = () => setCurrentIndexDoc((p) => (p === 0 ? documents.length - 1 : p - 1));
  const nextDocSlide = () => setCurrentIndexDoc((p) => (p === documents.length - 1 ? 0 : p + 1));

  // ── Effects ────────────────────────────────────
  useEffect(() => { handleView(); }, []);

  useEffect(() => {
    if (images.length > 1) {
      const t = setInterval(nextSlide, 4500);
      return () => clearInterval(t);
    }
  }, [images.length]);

  // ── Tabs Auto-Scroll Timer (15 seconds) ────────
  useEffect(() => {
    const tabs = ["summary", "astro", "family", "documents"];
    const timer = setTimeout(() => {
      setActiveTab((currentTab) => {
        const currentIndex = tabs.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // ── Mask helpers ───────────────────────────────
  const maskMobile = (v) => (typeof v === "string" ? v.slice(0, 3) + "*******" : v);
  const maskEmail  = (v) => {
    if (typeof v !== "string") return v;
    const [name, domain] = v.split("@");
    return name.slice(0, 3) + "****@" + (domain || "");
  };

  // ── Loading / Error ────────────────────────────
  if (loading) {
    return (
      <>
        <Profilenavbar />
        <div className={styles.centerState}>
          <div className={styles.spinner}></div>
          <h5 style={{ fontFamily: "'Playfair Display', serif", color: "#7B1A1A", marginTop: "16px" }}>
            Loading Profile…
          </h5>
        </div>
      </>
    );
  }

  if (error) {
    const isLimitError = error.response?.status === 403 || error.response?.data?.limitExceeded;
    const limitDetails = error.response?.data || {};

    if (isLimitError) {
      return (
        <>s
          <Profilenavbar />
          <div className={styles.centerState} style={{ padding: "40px 20px", maxWidth: "600px", margin: "40px auto" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(123, 26, 26, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              color: "#7B1A1A"
            }}>
              <i className="fas fa-lock" style={{ fontSize: "2.5rem" }}></i>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#7B1A1A", fontWeight: "700", marginBottom: "12px" }}>
              Profile View Limit Reached
            </h3>
            <p style={{ color: "#555", fontSize: "1rem", lineHeight: "1.6", marginBottom: "24px" }}>
              {limitDetails.message || "You have reached your limit for viewing profile details under your current plan."}
            </p>

            <div style={{
              background: "#FDF8F8",
              border: "1px solid #F3E1E1",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
              textAlign: "left"
            }}>
              <h5 style={{ fontWeight: "700", color: "#7B1A1A", marginBottom: "12px", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Your View Usage
              </h5>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Allowed Views:</span>
                <span style={{ fontWeight: "600", color: "#333" }}>{limitDetails.limitCount} profiles</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Views Used:</span>
                <span style={{ fontWeight: "600", color: "#333" }}>{limitDetails.currentViews} profiles</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Quota Reset:</span>
                <span style={{ fontWeight: "600", color: "#7B1A1A", textTransform: "capitalize" }}>{limitDetails.periodType} period</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                className={styles.backBtn} 
                onClick={() => navigate("/settings")}
                style={{ background: "#7B1A1A", color: "white", border: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fas fa-crown"></i> Upgrade Plan
              </button>
              <button className={styles.backBtn} onClick={handleGoBack} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <FaArrowLeft /> Go Back
              </button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Profilenavbar />
        <div className={styles.centerState}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#7B1A1A" }}>
            Error Loading Profile
          </h4>
          <p style={{ color: "#888" }}>{error.response?.data?.message || error.message || "Something went wrong."}</p>
          <button className={styles.backBtn} onClick={handleGoBack}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </>
    );
  }

  const displayName = (Data?.name && String(Data.name).trim()) ||
    [Data?.firstName, Data?.middleName, Data?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || `Matri ID: ${Data.martrId || "N/A"}`;
  // Use same effective connection detection as SearchPage to keep behavior consistent
  const getEffectiveConnectionStatus = (profile) => {
    const status = String(profile?.connectionStatus || profile?.contactRequestStatus || profile?.status || "").trim().toLowerCase();
    if (["accepted", "pending", "rejected"].includes(status)) return status;

    const currentUserId = String(authUserData?._id || "").trim();
    const getParticipantId = (item) => {
      return String(item?.userId?._id || item?.userId || item?._id || item?.profile?._id || item?.profile || item?.to?._id || item?.to || "").trim();
    };
    const acceptedArray = (arr) => Array.isArray(arr) && arr.some((item) => {
      const s = String(item?.status || "").trim().toLowerCase();
      if (s !== "accepted") return false;
      if (!currentUserId) return true;
      return getParticipantId(item) === currentUserId;
    });

    if (acceptedArray(profile?.reqSent)) return "accepted";
    if (acceptedArray(profile?.reqReceived)) return "accepted";
    if (acceptedArray(profile?.contactReqSent)) return "accepted";
    if (acceptedArray(profile?.contactReqReceived)) return "accepted";

    return null;
  };

  const connStatus = getEffectiveConnectionStatus(Data);
  const isOwnProfile = Data?._id && authUserData?._id && String(Data._id) === String(authUserData._id);
  const canShowName = isOwnProfile || connStatus === "accepted";
  const profileTitleStyle = {};

  const hasHoroscope = Data.HoroscopicId &&
    Object.keys(Data.HoroscopicId).some((k) => !["_id", "__v", "userId"].includes(k));

  const hasCareer = Data.profdetailsId &&
    Object.keys(Data.profdetailsId).some((k) => !["_id", "__v", "userId"].includes(k));

  const hasFamily = isaccepted && Data.familyDetails &&
    Object.keys(Data.familyDetails).some((k) => !["_id", "__v", "userId"].includes(k));

  const hasPaternal = isaccepted && paternaldetails &&
    Object.keys(paternaldetails).some((k) => !["_id", "__v", "userId", "updatedAt", "createdAt"].includes(k));

  const hasRelatives = ["badePapa","bhuasa","kakosa","mamosa","masisa"]
    .some((k) => Array.isArray(paternaldetails[k]) && paternaldetails[k].length > 0);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Profilenavbar />

      <div className={styles.pageWrapper}>
        {/* Floating Gold Spec Particles (Interactive Screen Only) */}
        <div className={styles.screenOnly}>
          <GoldDust />
        </div>

        <div className={styles.pageContainer}>

          {/* ──────────────────────────────────────────────────────── */}
          {/* SCREEN LAYOUT (Interactive, tabbed, animated)           */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className={styles.screenOnly}>
            {/* Back / Action buttons row */}
            <div className={styles.headerRow}>
              <button
                className={styles.backBtn}
                onClick={handleGoBack}
              >
                <FaArrowLeft /> Back
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className={styles.backBtn} onClick={copyProfileLink}>
                  <FaCopy /> Share
                </button>
                <button className={styles.printBtn} onClick={() => window.print()}>
                  <FaPrint /> Print
                </button>
              </div>
            </div>

            {/* Premium Navigation Tabs */}
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabButton} ${activeTab === "summary" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("summary")}
              >
                <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaInfoCircle className={styles.tabIcon} /> Summary
                </span>
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "astro" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("astro")}
              >
                <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaSun className={styles.tabIcon} />
                  <span className={styles.tabTextFull}>Kundali &amp; Astro</span>
                  <span className={styles.tabTextShort}>Kundali</span>
                </span>
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "family" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("family")}
              >
                <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaUsers className={styles.tabIcon} />
                  <span className={styles.tabTextFull}>Family &amp; Ancestry</span>
                  <span className={styles.tabTextShort}>Family</span>
                </span>
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "documents" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("documents")}
              >
                <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaFileAlt className={styles.tabIcon} />
                  <span className={styles.tabTextFull}>Verification Docs</span>
                  <span className={styles.tabTextShort}>Docs</span>
                </span>
              </button>
            </div>

            {/* Main Master Card */}
            <motion.div
              className={styles.biodataCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Spinning Mandala Watermarks in Background */}
              <MandalaSVG className={styles.spinningMandala} />
              <MandalaSVG className={styles.spinningMandalaLeft} />

              {/* Header card ornaments */}
              <div className={styles.biodataHeader}>
                <p className={styles.biodataSlogan}>Trusted Connections. Happy Futures.</p>
                <div className={styles.goldFlourish}>
                  <span className={styles.flourishIcon}>❧</span>
                  <span className={styles.flourishIcon}>✦</span>
                  <span className={styles.flourishIcon}>❧</span>
                </div>
              </div>

              {/* Grid Layout - rightPanel first in DOM so photo is at top on mobile */}
              <div className={styles.biodataGrid} style={{ position: "relative", zIndex: 2 }}>
                <div className={styles.tabContent}>
                  <AnimatePresence>
                    {activeTab === "summary" && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* PERSONAL DETAILS */}
                        <SectionRibbon>Personal Information</SectionRibbon>
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className={styles.detailsList}
                        >
                          {Object.keys(formData).map((key) => {
                            // Backend already returns masked/unmasked values based on request status
                            // So we just use formData[key] directly
                            const val = formData[key] || "N/A";
                      const isReqAccepted = Data?.contactRequestStatus === "accepted";
                      const hasFullContact = isReqAccepted;
                            
                            const cfg = basicDetailsConfig[key] || {
                              label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
                              icon: <FaUser />,
                            };
                            
                            return (
                              <motion.div key={key} variants={itemVariants}>
                                <DetailRow 
                                  icon={cfg.icon} 
                                  label={cfg.label} 
                                  value={val} 
                                  isLockedContact={!hasFullContact && (key === "mobile" || key === "email")}
                                  contactRequestStatus={Data?.contactRequestStatus}
                                  onRequestAccess={handleRequestDetails}
                                />
                              </motion.div>
                            );
                          })}
                        </motion.div>

                        {/* CAREER & EDUCATION */}
                        <div style={{ marginTop: "30px" }}>
                          <SectionRibbon>Career &amp; Education</SectionRibbon>
                          {hasCareer ? (
                            <motion.div
                              variants={listVariants}
                              initial="hidden"
                              animate="visible"
                              className={styles.detailsList}
                            >
                              {Object.entries(Data.profdetailsId)
                                .filter(([k]) => !["_id", "__v", "userId"].includes(k))
                                .map(([key, val]) => (
                                  <motion.div key={key} variants={itemVariants}>
                                    <DetailRow
                                      icon={getEducationIcon(key)}
                                      label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                                      value={Array.isArray(val) ? formatArrayValue(key, val) : val?.trim ? (val?.trim() ? val : "N/A") : (val != null ? String(val) : "N/A")}
                                    />
                                  </motion.div>
                                ))}
                            </motion.div>
                          ) : (
                            <p style={{ color: "var(--text-soft)", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
                              Career details have not been updated yet.
                            </p>
                          )}
                        </div>

                        {/* ABOUT ME */}
                        {Data.additionalInfo && Data.additionalInfo !== "N/A" && (
                          <div style={{ marginTop: "30px" }}>
                            <SectionRibbon>About Me</SectionRibbon>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={styles.premiumTextCard}
                            >
                              <div className={styles.premiumCardIcon}>
                                <FaUser />
                              </div>
                              <p className={styles.premiumCardText}>
                                {Data.additionalInfo}
                              </p>
                            </motion.div>
                          </div>
                        )}

                        {/* PARTNER PREFERENCES */}
                        {(Data.partnerPreferences || Data.familyInfo || Data.familyDetails?.familyInfo) && (Data.partnerPreferences || Data.familyInfo || Data.familyDetails?.familyInfo) !== "N/A" && (
                          <div style={{ marginTop: "30px" }}>
                            <SectionRibbon>Partner Preferences</SectionRibbon>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={styles.premiumTextCard}
                            >
                              <div className={styles.premiumCardIcon}>
                                <FaHeart />
                              </div>
                              <p className={styles.premiumCardText}>
                                {Data.partnerPreferences || Data.familyInfo || Data.familyDetails?.familyInfo}
                              </p>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "astro" && (
                      <motion.div
                        key="astro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <SectionRibbon>Zodiac &amp; Horoscope Details</SectionRibbon>
                        {hasHoroscope ? (
                          <motion.div
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className={styles.astroGrid}
                          >
                            {Object.entries(Data.HoroscopicId)
                              .filter(([k]) => !["_id", "__v", "userId"].includes(k))
                              .map(([key, val]) => (
                                <motion.div key={key} variants={itemVariants}>
                                  <DetailRow
                                    icon={getHoroscopeIcon(key)}
                                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                                    value={val || "N/A"}
                                  />
                                </motion.div>
                              ))}
                          </motion.div>
                        ) : (
                          <p style={{ color: "var(--text-soft)", fontStyle: "italic", textAlign: "center", padding: "40px" }}>
                            Horoscope details are not provided for this profile.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "family" && (
                      <motion.div
                        key="family"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {isaccepted ? (
                          <div>
                            {/* Family Details */}
                            {hasFamily && (
                              <div style={{ marginBottom: "32px" }}>
                                <SectionRibbon>Family Information</SectionRibbon>
                                <motion.div
                                  variants={listVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className={styles.detailsList}
                                >
                                  {Object.entries(Data.familyDetails)
                                    .filter(([k, v]) => !["_id", "__v", "userId"].includes(k) && !Array.isArray(v))
                                    .map(([key, val]) => (
                                      <motion.div key={key} variants={itemVariants}>
                                        <DetailRow
                                          icon={getFamilyIcon(key)}
                                          label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                                          value={typeof val === "string" && val?.trim() ? val : (val != null && typeof val !== "object" ? String(val) : "N/A")}
                                        />
                                      </motion.div>
                                    ))}
                                </motion.div>
                              </div>
                            )}

                            {/* Siblings Details */}
                            {(Data.familyDetails?.elderBrother?.some(b => b.name) ||
                              Data.familyDetails?.elderSister?.some(s => s.name) ||
                              Data.familyDetails?.youngerBrother?.some(b => b.name) ||
                              Data.familyDetails?.youngerSister?.some(s => s.name)) && (
                              <div style={{ marginBottom: "32px" }}>
                                <SectionRibbon>Siblings Information</SectionRibbon>
                                <motion.div
                                  variants={listVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className={styles.relGrid}
                                >
                                  {[
                                    { key: "elderBrother", title: "Elder Brother" },
                                    { key: "elderSister", title: "Elder Sister" },
                                    { key: "youngerBrother", title: "Younger Brother" },
                                    { key: "youngerSister", title: "Younger Sister" },
                                  ].map(({ key, title }) =>
                                    Data.familyDetails[key]?.map((person, idx) => {
                                      if (!person.name) return null;
                                      return (
                                        <motion.div className={styles.relCard} key={`sib-${key}-${idx}`} variants={itemVariants}>
                                          <span className={styles.relRelation}>{title}</span>
                                          <div className={styles.relInfoItem}>
                                            <span className={styles.relInfoLabel}>Name:</span>
                                            <span className={styles.relInfoVal}>{person.name || "N/A"}</span>
                                          </div>
                                          <div className={styles.relInfoItem}>
                                            <span className={styles.relInfoLabel}>Married To:</span>
                                            <span className={styles.relInfoVal}>{person.marriedto || "N/A"}</span>
                                          </div>
                                          {(person.daughterof || person.sonof) && (
                                            <div className={styles.relInfoItem}>
                                              <span className={styles.relInfoLabel}>
                                                {person.daughterof ? "Daughter of:" : "Son of:"}
                                              </span>
                                              <span className={styles.relInfoVal}>{person.daughterof || person.sonof || "N/A"}</span>
                                            </div>
                                          )}
                                          <div className={styles.relInfoItem}>
                                            <span className={styles.relInfoLabel}>Native Place:</span>
                                            <span className={styles.relInfoVal}>{person.thikana || "N/A"}</span>
                                          </div>
                                        </motion.div>
                                      );
                                    })
                                  )}
                                </motion.div>
                              </div>
                            )}

                            {/* Paternal Details */}
                            {hasPaternal && (
                              <div style={{ marginBottom: "32px" }}>
                                <SectionRibbon>Paternal Ancestry</SectionRibbon>
                                <div className={styles.ancestryGrid}>
                                  {/* Grandfather / Grandmother Card */}
                                  <motion.div
                                    className={styles.ancestryCard}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <h5 className={styles.ancestryHeader}>
                                      <FaUser /> Paternal Grandparents
                                    </h5>
                                    {Object.entries(paternaldetails)
                                      .filter(([k, v]) => !Array.isArray(v) && !["_id", "__v", "userId", "updatedAt", "createdAt"].includes(k) && k.startsWith("grand"))
                                      .map(([key, val]) => (
                                        <div key={key} style={{ marginBottom: "12px" }}>
                                          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-soft)", textTransform: "uppercase" }}>
                                            {keyNameMapping[key] || key.replace(/([A-Z])/g, " $1")}
                                          </div>
                                          <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-dark)" }}>
                                            {val || "N/A"}
                                          </div>
                                        </div>
                                      ))}
                                  </motion.div>

                                  {/* Maternal Grandparents Card */}
                                  <motion.div
                                    className={styles.ancestryCard}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <h5 className={styles.ancestryHeader}>
                                      <FaUserFriends /> Maternal Grandparents
                                    </h5>
                                    {Object.entries(paternaldetails)
                                      .filter(([k, v]) => !Array.isArray(v) && !["_id", "__v", "userId", "updatedAt", "createdAt"].includes(k) && k.startsWith("maternal"))
                                      .map(([key, val]) => (
                                        <div key={key} style={{ marginBottom: "12px" }}>
                                          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-soft)", textTransform: "uppercase" }}>
                                            {keyNameMapping[key] || key.replace(/([A-Z])/g, " $1")}
                                          </div>
                                          <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-dark)" }}>
                                            {val || "N/A"}
                                          </div>
                                        </div>
                                      ))}
                                  </motion.div>
                                </div>
                              </div>
                            )}

                            {/* Relatives Information Cards */}
                            {hasRelatives && (
                              <div>
                                <SectionRibbon>Relatives Information</SectionRibbon>
                                <motion.div
                                  variants={listVariants}
                                  initial="hidden"
                                  animate="visible"
                                  className={styles.relGrid}
                                >
                                  {["badePapa", "bhuasa", "kakosa", "mamosa", "masisa"].map((rk) =>
                                    paternaldetails[rk]?.length > 0
                                      ? paternaldetails[rk].map((person, idx) => (
                                          <motion.div className={styles.relCard} key={`${rk}-${idx}`} variants={itemVariants}>
                                            <span className={styles.relRelation}>
                                              {rk.replace(/([A-Z])/g, " $1")}
                                            </span>
                                            <div className={styles.relInfoItem}>
                                              <span className={styles.relInfoLabel}>Name:</span>
                                              <span className={styles.relInfoVal}>{person.name || "N/A"}</span>
                                            </div>
                                            <div className={styles.relInfoItem}>
                                              <span className={styles.relInfoLabel}>Married To:</span>
                                              <span className={styles.relInfoVal}>{person.marriedto || "N/A"}</span>
                                            </div>
                                            <div className={styles.relInfoItem}>
                                              <span className={styles.relInfoLabel}>Son/Daughter of:</span>
                                              <span className={styles.relInfoVal}>{person.sonof || person.daughterof || "N/A"}</span>
                                            </div>
                                            <div className={styles.relInfoItem}>
                                              <span className={styles.relInfoLabel}>Thikana:</span>
                                              <span className={styles.relInfoVal}>{person.thikana || "N/A"}</span>
                                            </div>
                                          </motion.div>
                                        ))
                                      : null
                                  )}
                                </motion.div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Locked State UX Overlay with blurred underlay */
                          <div className={styles.lockContainer}>
                            <motion.div
                              className={styles.lockOverlay}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div className={styles.lockIconCircle}>
                                <FaLock />
                              </div>
                              <h4 className={styles.lockTitle}>Ancestry &amp; Family Details Locked</h4>
                              <p className={styles.lockDesc}>
                                Complete family background, maternal/paternal grand ancestry, and relatives thikanas are restricted. Connect with this member to unlock access.
                              </p>
                              {Data?.contactRequestStatus === "pending" ? (
                                <button className={styles.lockBtn} disabled style={{ opacity: 0.85, background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" }}>
                                  <FaClock /> Request Pending
                                </button>
                              ) : Data?.contactRequestStatus === "rejected" ? (
                                <button className={styles.lockBtn} disabled style={{ opacity: 0.85, background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" }}>
                                  <FaTimes /> Request Rejected
                                </button>
                              ) : (
                                <button className={styles.lockBtn} onClick={handleRequestDetails}>
                                  Request Connection Access
                                </button>
                              )}
                            </motion.div>
                            
                            {/* Blurred skeleton tree underlay */}
                            <div className={styles.skeletonTree}>
                              <div className={styles.skelLineThick}></div>
                              <div style={{ display: "flex", gap: "20px" }}>
                                <div className={styles.skelLine} style={{ flex: 1 }}></div>
                                <div className={styles.skelLine} style={{ flex: 1 }}></div>
                              </div>
                              <div className={styles.skelLineShort}></div>
                              <div className={styles.skelLineThick}></div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "documents" && (
                      <motion.div
                        key="documents"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <SectionRibbon>Verification &amp; Documents</SectionRibbon>
                        {(() => {
                          const isDocPrivate = (Data?.filesId?.documentsPrivate || Data?.filesId?.isDocPrivate) && Data?.documentRequestStatus !== "accepted";
                          if (isDocPrivate) {
                            return (
                              <div style={{
                                padding: "40px 20px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                background: "rgba(255,255,255,0.7)",
                                borderRadius: "12px",
                                border: "1px dashed var(--royal-gold, #d4af37)",
                                margin: "20px 0"
                              }}>
                                <FaLock size={32} style={{ color: "var(--royal-maroon, #7B1A1A)" }} />
                                <h6 style={{ fontWeight: "700", color: "var(--royal-maroon, #7B1A1A)", margin: 0 }}>
                                  Document on Request
                                </h6>
                                <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>
                                  The member has set their verification documents to "On Request".
                                </p>
                                {Data?.documentRequestStatus === "pending" ? (
                                  <button
                                    disabled
                                    style={{
                                      background: "rgba(255,193,7,0.2)",
                                      color: "#ffc107",
                                      border: "1px solid #ffc107",
                                      padding: "8px 20px",
                                      borderRadius: "20px",
                                      fontSize: "0.85rem",
                                      cursor: "not-allowed",
                                      fontWeight: "600"
                                    }}
                                  >
                                    Request Pending
                                  </button>
                                ) : Data?.documentRequestStatus === "rejected" ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDocumentRequest(); }}
                                    disabled={docReqLoading}
                                    style={{
                                      background: docReqLoading ? "rgba(123,26,26,0.6)" : "var(--royal-maroon, #7B1A1A)",
                                      color: "#fff",
                                      border: "1px solid var(--royal-gold, #d4af37)",
                                      padding: "8px 20px",
                                      borderRadius: "20px",
                                      fontSize: "0.85rem",
                                      cursor: docReqLoading ? "not-allowed" : "pointer",
                                      fontWeight: "600",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "7px",
                                      minWidth: "140px",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {docReqLoading ? (
                                      <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "docSpinAnim 0.8s linear infinite", flexShrink: 0 }}>
                                          <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                        Sending…
                                      </>
                                    ) : "Resend Request"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDocumentRequest(); }}
                                    disabled={docReqLoading}
                                    style={{
                                      background: docReqLoading ? "rgba(123,26,26,0.6)" : "var(--royal-maroon, #7B1A1A)",
                                      color: "#fff",
                                      border: "1px solid var(--royal-gold, #d4af37)",
                                      padding: "8px 20px",
                                      borderRadius: "20px",
                                      fontSize: "0.85rem",
                                      cursor: docReqLoading ? "not-allowed" : "pointer",
                                      fontWeight: "600",
                                      boxShadow: docReqLoading ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "7px",
                                      minWidth: "155px",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {docReqLoading ? (
                                      <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "docSpinAnim 0.8s linear infinite", flexShrink: 0 }}>
                                          <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                        Sending…
                                      </>
                                    ) : "Request Document"}
                                  </button>
                                )}
                              </div>
                            );
                          }

                          return documents.length > 0 ? (
                            <div className={styles.docContainer}>
                              <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "12px", textAlign: "center" }}>
                                Click on a document to enlarge view
                              </p>
                              <div className={styles.docFrame} onClick={() => {
                                setLightboxIndex(0);
                                setIsLightboxOpen(true);
                              }}>
                                <AnimatePresence initial={false} mode="wait">
                                  <motion.img
                                    key={currentIndexDoc}
                                    src={getMediaUrl(documents[currentIndexDoc])}
                                    alt="Document"
                                    className={styles.docImg}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </AnimatePresence>
                                {documents.length > 1 && (
                                  <>
                                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={(e) => { e.stopPropagation(); prevDocSlide(); }}>
                                      <ChevronLeft size={16} />
                                    </button>
                                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={(e) => { e.stopPropagation(); nextDocSlide(); }}>
                                      <ChevronRight size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p style={{ color: "var(--text-soft)", fontStyle: "italic", textAlign: "center", padding: "40px" }}>
                              No verification documents uploaded for this profile.
                            </p>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right panel profile summary & photo */}
                <div className={styles.rightPanel}>
                  {/* Photo Carousel Frame */}
                  {(() => {
                    const isPhotoPrivate = Data?.filesId?.isPrivate && Data?.photoRequestStatus !== "accepted";
                    const photoReqStatus = Data?.photoRequestStatus;
                    return (
                      <>
                        <div className={styles.photoFrame} onClick={() => {
                          if (!isPhotoPrivate && images.length > 0) {
                            setLightboxIndex(currentIndex);
                            setIsLightboxOpen(true);
                          }
                        }}>
                          {/* Verification Badge */}
                          {Data?.isVerified && (
                            <span className={styles.verifiedBadge}>
                              <FaShieldAlt /> Verified
                            </span>
                          )}

                          <AnimatePresence initial={false} mode="wait">
                            {isPhotoPrivate ? (
                              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                <motion.img
                                  key="private"
                                  src={Data?.gender === "Female" ? femaleDefault : maleDefault}
                                  alt="Private"
                                  className={styles.carouselImg}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.35 }}
                                />
                                <div style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "rgba(0,0,0,0.5)",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                  padding: "12px",
                                  zIndex: 10
                                }}>
                                  <span style={{ color: "#fff", fontWeight: "700", fontSize: "0.9rem" }}>Photo on Request</span>
                                  {photoReqStatus === "pending" ? (
                                    <button
                                      disabled
                                      style={{
                                        background: "rgba(255,193,7,0.2)",
                                        color: "#ffc107",
                                        border: "1px solid #ffc107",
                                        padding: "6px 16px",
                                        borderRadius: "20px",
                                        fontSize: "0.82rem",
                                        cursor: "not-allowed"
                                      }}
                                    >
                                      Request Pending
                                    </button>
                                  ) : photoReqStatus === "rejected" ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handlePhotoRequest(); }}
                                      style={{
                                        background: "var(--royal-maroon, #7B1A1A)",
                                        color: "#fff",
                                        border: "1px solid var(--royal-gold, #d4af37)",
                                        padding: "6px 16px",
                                        borderRadius: "20px",
                                        fontSize: "0.82rem",
                                        cursor: "pointer"
                                      }}
                                    >
                                      Resend Photo Request
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handlePhotoRequest(); }}
                                      style={{
                                        background: "var(--royal-maroon, #7B1A1A)",
                                        color: "#fff",
                                        border: "1px solid var(--royal-gold, #d4af37)",
                                        padding: "6px 16px",
                                        borderRadius: "20px",
                                        fontSize: "0.82rem",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                                      }}
                                    >
                                      Request Photo
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : images.length > 0 ? (
                              <motion.img
                                key={currentIndex}
                                src={getMediaUrl(images[currentIndex])}
                                alt="Profile"
                                className={styles.carouselImg}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.35 }}
                              />
                            ) : (
                              <motion.img
                                key="placeholder"
                                src={getMediaUrl(Data?.imageUrl) || (Data?.gender === "Female" ? femaleDefault : maleDefault)}
                                alt="Placeholder"
                                className={styles.carouselImg}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                              />
                            )}
                          </AnimatePresence>

                          {!isPhotoPrivate && images.length > 1 && (
                            <>
                              <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
                                <ChevronLeft size={20} />
                              </button>
                              <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
                                <ChevronRight size={20} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Dots pagination */}
                        {!isPhotoPrivate && images.length > 1 && (
                          <div className={styles.dotsPagination}>
                            {images.map((_, i) => (
                              <span
                                key={i}
                                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""}`}
                                onClick={() => setCurrentIndex(i)}
                              />
                            ))}
                          </div>
                        )}

                        {/* Thumb strip */}
                        {!isPhotoPrivate && images.length > 1 && (
                          <div className={styles.thumbStrip}>
                            {images.map((img, i) => (
                              <img
                                key={i}
                                src={getMediaUrl(img)}
                                alt={`Thumbnail ${i + 1}`}
                                className={`${styles.thumb} ${i === currentIndex ? styles.thumbActive : ""}`}
                                onClick={() => setCurrentIndex(i)}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}

               
                  <h1 className={styles.profileName} style={profileTitleStyle}>{canShowName ? displayName : `Matri ID: ${Data.martrId || "N/A"}`}</h1>
                  {!canShowName && <div className={styles.profileId}>ID: {Data.martrId || "N/A"}</div>}

                  {/* Quick pills info */}
                  <div className={styles.quickPills}>
                    {Data.maritalStatus && Data.maritalStatus !== "N/A" && (
                      <span className={styles.pill}>
                        <FaHeart className={styles.pillIcon} /> {Data.maritalStatus}
                      </span>
                    )}
                    {Data.height && (
                      <span className={styles.pill}>
                        <FaRulerVertical className={styles.pillIcon} /> {Data.height.feet}′{Data.height.inches}″
                      </span>
                    )}
                    {(Data.address?.city || Data.address?.state) && (
                      <span className={styles.pill}>
                        <FaMapMarkerAlt className={styles.pillIcon} /> {Data.address?.city || Data.address?.state}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Badges */}
              <div className={styles.biodataFooter}>
                {Data?.isVerified && (
                  <span className={styles.footerBadge}>
                    <FaShieldAlt /> 100% Verified
                  </span>
                )}
                <span className={styles.footerBadge}>
                  <FaHandshake /> Rajput Clan Matrimony
                </span>
                <span className={styles.footerBadge}>
                  <FaLock /> Complete Privacy
                </span>
              </div>
            </motion.div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* DEDICATED PRINT VIEW (Flat, multi-page booklet style)    */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className={styles.printOnly}>
            <div className={styles.biodataCard}>
              {/* Printed Biodata Header */}
              <div className={styles.biodataHeader}>
                <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#7B1A1A", marginBottom: "4px" }}>
                  RAJPUTANA MATRIMONIALS
                </h1>
                <p className={styles.biodataSlogan}>Trusted Connections. Happy Futures.</p>
                <div className={styles.goldFlourish}>
                  <span>❧ ✦ ❧</span>
                </div>
              </div>

              {/* Print Grid: Left columns, Right photo block */}
              <div className={styles.printGrid}>
                {/* Left side details */}
                <div>
                  <SectionRibbon>Personal Information</SectionRibbon>
                  <div className={styles.detailsList}>
                    {Object.keys(formData).map((key) => {
                      // Backend already returns masked/unmasked values based on request status
                      const val = formData[key] || "N/A";
                      const isReqAccepted = Data?.contactRequestStatus === "accepted";
                      const hasFullContact = isReqAccepted;
                      
                      const cfg = basicDetailsConfig[key] || {
                        label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
                        icon: <FaUser />,
                      };
                      
                      return (
                        <DetailRow 
                          key={key} 
                          icon={cfg.icon} 
                          label={cfg.label} 
                          value={val} 
                          isLockedContact={!hasFullContact && (key === "mobile" || key === "email")}
                          contactRequestStatus={Data?.contactRequestStatus}
                          onRequestAccess={handleRequestDetails}
                        />
                      );
                    })}
                  </div>

                  {hasHoroscope && (
                    <div style={{ marginTop: "24px" }}>
                      <SectionRibbon>Horoscope &amp; Astrology</SectionRibbon>
                      <div className={styles.detailsList}>
                        {Object.entries(Data.HoroscopicId)
                          .filter(([k]) => !["_id", "__v", "userId"].includes(k))
                          .map(([key, val]) => (
                            <DetailRow
                              key={key}
                              icon={getHoroscopeIcon(key)}
                              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              value={val || "N/A"}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {hasCareer && (
                    <div style={{ marginTop: "24px" }}>
                      <SectionRibbon>Career &amp; Education</SectionRibbon>
                      <div className={styles.detailsList}>
                        {Object.entries(Data.profdetailsId)
                          .filter(([k]) => !["_id", "__v", "userId"].includes(k))
                          .map(([key, val]) => (
                            <DetailRow
                              key={key}
                              icon={getEducationIcon(key)}
                              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              value={Array.isArray(val) ? formatArrayValue(key, val) : val?.trim ? (val?.trim() ? val : "N/A") : (val != null ? String(val) : "N/A")}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side portrait block */}
                <div style={{ textAlign: "center" }}>
                  <div className={styles.photoFrame}>
                    <img
                      src={images.length > 0 ? images[0].url : ((Data?.imageUrl && !Data.imageUrl.includes("profile.png") && !Data.imageUrl.includes("user-icon-flat-isolated") && !Data.imageUrl.includes("istockphoto.com")) ? Data.imageUrl : (Data?.gender === "Female" ? femaleDefault : maleDefault))}
                      alt="Printed Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                
                  <div className={styles.profileId}>ID: {Data.martrId || "N/A"}</div>
                  <div className={styles.quickPills} style={{ justifyContent: "center" }}>
                    {Data.maritalStatus && <span className={styles.pill}>{Data.maritalStatus}</span>}
                    {Data.height && <span className={styles.pill}>{Data.height.feet}′{Data.height.inches}″</span>}
                    {(Data.address?.city || Data.address?.state) && <span className={styles.pill}>{Data.address?.city || Data.address?.state}</span>}
                  </div>
                </div>
              </div>

              {/* Family & Relatives continuous print layouts */}
              <div className={styles.fullWidthSection}>
                <SectionRibbon>Family &amp; Relatives Information</SectionRibbon>
                {isaccepted ? (
                  <div>
                    {hasFamily && (
                      <div className={styles.detailsList} style={{ marginBottom: "20px" }}>
                        {Object.entries(Data.familyDetails)
                          .filter(([k, v]) => !["_id", "__v", "userId"].includes(k) && !Array.isArray(v))
                          .map(([key, val]) => (
                            <DetailRow
                              key={key}
                              icon={getFamilyIcon(key)}
                              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                              value={typeof val === "string" && val?.trim() ? val : (val != null ? String(val) : "N/A")}
                            />
                          ))}
                      </div>
                    )}

                    {hasPaternal && (
                      <div className={styles.ancestryGrid} style={{ marginBottom: "20px" }}>
                        <div className={styles.ancestryCard}>
                          <h5 className={styles.ancestryHeader}>Paternal Grandparents Details</h5>
                          {Object.entries(paternaldetails)
                            .filter(([k, v]) => !Array.isArray(v) && !["_id", "__v", "userId", "updatedAt", "createdAt"].includes(k) && k.startsWith("grand"))
                            .map(([key, val]) => (
                              <div key={key} style={{ marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#8B6040", textTransform: "uppercase" }}>
                                  {keyNameMapping[key] || key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <p style={{ fontSize: "0.85rem", margin: "2px 0 0", color: "#1E0A0A", fontWeight: "600" }}>{val || "N/A"}</p>
                              </div>
                            ))}
                        </div>

                        <div className={styles.ancestryCard}>
                          <h5 className={styles.ancestryHeader}>Maternal Grandparents Details</h5>
                          {Object.entries(paternaldetails)
                            .filter(([k, v]) => !Array.isArray(v) && !["_id", "__v", "userId", "updatedAt", "createdAt"].includes(k) && k.startsWith("maternal"))
                            .map(([key, val]) => (
                              <div key={key} style={{ marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#8B6040", textTransform: "uppercase" }}>
                                  {keyNameMapping[key] || key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <p style={{ fontSize: "0.85rem", margin: "2px 0 0", color: "#1E0A0A", fontWeight: "600" }}>{val || "N/A"}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {hasRelatives && (
                      <div className={styles.relGrid}>
                        {["badePapa", "bhuasa", "kakosa", "mamosa", "masisa"].map((rk) =>
                          paternaldetails[rk]?.length > 0
                            ? paternaldetails[rk].map((person, idx) => (
                                <div className={styles.relCard} key={`${rk}-${idx}`}>
                                  <span className={styles.relRelation}>{rk.replace(/([A-Z])/g, " $1")}</span>
                                  <div className={styles.relInfoItem}>
                                    <span className={styles.relInfoLabel}>Name:</span>
                                    <span className={styles.relInfoVal}>{person.name || "N/A"}</span>
                                  </div>
                                  <div className={styles.relInfoItem}>
                                    <span className={styles.relInfoLabel}>Married To:</span>
                                    <span className={styles.relInfoVal}>{person.marriedto || "N/A"}</span>
                                  </div>
                                  <div className={styles.relInfoItem}>
                                    <span className={styles.relInfoLabel}>Thikana:</span>
                                    <span className={styles.relInfoVal}>{person.thikana || "N/A"}</span>
                                  </div>
                                </div>
                              ))
                            : null
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.lockContainer} style={{ minHeight: "140px" }}>
                    <div className={styles.lockOverlay}>
                      <h4 className={styles.lockTitle} style={{ fontSize: "1.1rem" }}>Family Details Restricted</h4>
                      <p className={styles.lockDesc} style={{ fontSize: "0.8rem", margin: "0" }}>
                        Family and paternal grand ancestry details are locked. Connect with this member to request details access.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Print Footer badges */}
              <div className={styles.biodataFooter}>
                {Data?.isVerified && (
                  <span className={styles.footerBadge}>Profile Verification: Verified Member</span>
                )}
                <span className={styles.footerBadge}>Rajput Alliances platform</span>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* FLOATING ACTION CONTROL BAR (Desktop screen view)        */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className={styles.floatingActions}>
            <button className={styles.floatBtn} onClick={handleGoBack}>
              <FaArrowLeft />
              <span className={styles.tooltipText}>Go Back</span>
            </button>
            <button className={styles.floatBtn} onClick={copyProfileLink}>
              <FaCopy />
              <span className={styles.tooltipText}>Copy Share Link</span>
            </button>
            <button className={styles.floatBtn} onClick={() => window.print()}>
              <FaPrint />
              <span className={styles.tooltipText}>Print Biodata</span>
            </button>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* LIGHTBOX PHOTO GALLERY PORTAL                            */}
          {/* ──────────────────────────────────────────────────────── */}
          {isLightboxOpen && (
            <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
              <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.lightboxClose} onClick={() => setIsLightboxOpen(false)}>
                  <FaTimes />
                </button>
                <img
                  src={images.length > 0 ? getMediaUrl(images[lightboxIndex]) : (getMediaUrl(Data?.imageUrl) || (Data?.gender === "Female" ? femaleDefault : maleDefault))}
                  alt="Full-size Profile"
                  className={styles.lightboxImg}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                      onClick={() => setLightboxIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                      onClick={() => setLightboxIndex((p) => (p === images.length - 1 ? 0 : p + 1))}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                <div className={styles.lightboxCounter}>
                  {images.length > 0 ? `${lightboxIndex + 1} / ${images.length}` : "0 / 0"}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ViewPage;
