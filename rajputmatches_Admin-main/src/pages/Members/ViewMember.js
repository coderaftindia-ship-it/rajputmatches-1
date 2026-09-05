import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft, FaCheck, FaTimes, FaBan, FaTrash,
  FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaRulerVertical, FaWeight, FaRing, FaBriefcase, FaGraduationCap,
  FaFileAlt, FaDownload, FaCompass, FaRegIdCard, FaHistory,
  FaInfoCircle, FaHeart, FaUsers,
  FaCrown, FaCheckCircle, FaUsersCog, FaCamera, FaEye, FaExpand,
  FaShieldAlt, FaLandmark, FaBookmark, FaHome, FaFemale, FaMapPin,
  FaBuilding, FaMoneyBillWave
} from "react-icons/fa";

const BASE_URL = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

/* ─────────────────────────── HELPERS ─────────────────────────── */
const getFullAddress = (addr) => {
  if (!addr) return "N/A";
  const parts = [
    addr.street,
    addr.city,
    addr.district,
    addr.state,
    addr.country,
    addr.zipCode
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

const getFileUrl = (url) => {
  if (!url) return "";
  if (typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const cleanPath = url.replace(/\\/g, "/");
  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  const domain = BASE_URL.replace(/\/admin$/, "");
  return `${domain}${formattedPath}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
};

const getCreatedDate = (member) => {
  if (member?.createdAt) return member.createdAt;
  if (member?._id && typeof member._id === "string" && member._id.length === 24) {
    const timestamp = parseInt(member._id.substring(0, 8), 16) * 1000;
    if (!isNaN(timestamp)) return new Date(timestamp);
  }
  return null;
};

const getBirthTime = (h) => {
  if (!h) return "N/A";
  if (h.birthTime) return h.birthTime;
  if (h.birthHour || h.birthMinute) {
    const period = h.birthTimePeriod || "";
    return `${h.birthHour || "00"}:${h.birthMinute || "00"} ${period}`.trim();
  }
  return "N/A";
};

const formatHeight = (h) => {
  if (!h) return "N/A";
  if (typeof h === "object") {
    return `${h.feet || 0}' ${h.inches || 0}"`;
  }
  return h;
};

const getAge = (dob) => {
  if (!dob) return "N/A";
  try {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch (e) {
    return "N/A";
  }
};

/* ─────────────────────────── COMPONENT ─────────────────────────── */
function ViewMember() {
  const { profileId } = useParams();
  const navigate = useNavigate();

  /* State */
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /* Photo selection state & Lightbox */
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxTitle, setLightboxTitle] = useState("");

  /* Fetch Data */
  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminAuthToken");
      const result = await axios.put(
        `${BASE_URL}/view-member`,
        { data: profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const response = result?.data?.user || result?.data?.profile || result?.data;
      if (response) {
        setMember(response);
      } else {
        toast.error("Member profile data not found.");
      }
    } catch (error) {
      console.error("Error fetching member profile:", error);
      toast.error("Failed to load member profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchMemberDetails();
    }
  }, [profileId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Extract Photo & Document Lists safely */
  const photos = Array.isArray(member?.filesId?.photos)
    ? member.filesId.photos
    : Array.isArray(member?.photos)
    ? member.photos
    : [];

  const docs = Array.isArray(member?.filesId?.documents)
    ? member.filesId.documents
    : Array.isArray(member?.documents)
    ? member.documents
    : [];

  const familyInfo = member?.familydetailsId || member?.familyDetails || {};
  const horoInfo = member?.HoroscopicId || {};
  const profInfo = member?.profdetailsId || {};
  const extFamily = member?.paternaldetails || {};

  /* Actions */
  const handleApproveStatus = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await axios.put(
        `${BASE_URL}/Approve-member`,
        { data: profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Approval status updated successfully!");
      await fetchMemberDetails();
    } catch (err) {
      console.error(err);
      toast.error("Approve action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockStatus = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await axios.put(
        `${BASE_URL}/block-member`,
        { data: profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Block status updated!");
      await fetchMemberDetails();
    } catch (err) {
      console.error(err);
      toast.error("Block action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this profile? This action is irreversible.")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await axios.put(
        `${BASE_URL}/delete-member`,
        { data: profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Profile deleted successfully.");
      navigate("/Members/Free-Members");
    } catch (err) {
      console.error(err);
      toast.error("Delete action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const openLightbox = (src, title) => {
    setLightboxSrc(src);
    setLightboxTitle(title || "Preview");
    setLightboxOpen(true);
  };

  /* PDF Download Handler */
  const handleDownloadPdf = () => {
    if (!member) return;
    const printWindow = window.open("", "_blank");
    const avatarUrl = getFileUrl(photos[imgIndex]?.url || member.avatar) || "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Biodata - ${member.firstName || ""} ${member.lastName || ""} (ID: ${member.martrId || ""})</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #3d1a2b; margin: 0; padding: 24px; background: #fff; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px double #D4AF37; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { font-family: 'Playfair Display', serif; color: #59123B; margin: 0 0 5px 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { color: #888; font-size: 13px; margin: 0; font-weight: 600; }
            .profile-box { display: flex; gap: 20px; align-items: center; background: #fdfaf7; border: 1.5px solid #f0e2d5; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
            .profile-img { width: 130px; height: 130px; border-radius: 50%; border: 3px solid #D4AF37; object-fit: cover; }
            .profile-info h2 { font-family: 'Playfair Display', serif; color: #59123B; margin: 0 0 8px 0; font-size: 22px; }
            .profile-info p { margin: 4px 0; font-size: 14px; color: #555; }
            .section-title { font-family: 'Playfair Display', serif; color: #59123B; font-size: 16px; font-weight: 700; border-bottom: 2px solid #59123B; padding-bottom: 5px; margin: 22px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
            .grid-item { font-size: 13px; }
            .label { font-weight: 600; color: #888; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 2px; }
            .value { font-weight: 700; color: #3d1a2b; font-size: 14px; }
            .relatives-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            .relatives-table th { background: #59123B; color: white; padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; }
            .relatives-table td { padding: 8px; border-bottom: 1px solid #eee; }
            .footer { text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #999; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rajput Alliances</h1>
            <p>CONFIDENTIAL MATRIMONIAL BIODATA</p>
          </div>

          <div class="profile-box">
            ${avatarUrl ? `<img src="${avatarUrl}" class="profile-img" />` : `<div class="profile-img" style="display:flex;align-items:center;justify-content:center;background:#59123B;color:#fff;font-size:36px;font-weight:700;">${(member.firstName?.[0] || "")}${(member.lastName?.[0] || "")}</div>`}
            <div class="profile-info">
              <h2>${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}</h2>
              <p><strong>Matrimony ID:</strong> ${member.martrId || "N/A"}</p>
              <p><strong>Profile Created for:</strong> ${member.profilefor || "Self"}</p>
              <p><strong>Age / Gender:</strong> ${getAge(member.dateOfBirth)} Yrs &bull; ${member.gender || "N/A"}</p>
              <p><strong>Height:</strong> ${formatHeight(member.height)} &bull; <strong>Marital Status:</strong> ${member.maritalStatus || "Unmarried"}</p>
            </div>
          </div>

          <div class="section-title">Personal & Contact Details</div>
          <div class="grid">
            <div class="grid-item"><span class="label">Date of Birth</span><span class="value">${formatDate(member.dateOfBirth)}</span></div>
            <div class="grid-item"><span class="label">Weight</span><span class="value">${member.weight ? `${member.weight} kg` : "N/A"}</span></div>
            <div class="grid-item"><span class="label">Email Address</span><span class="value">${member.email || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Mobile Phone</span><span class="value">${member.mobile || "N/A"}</span></div>
            <div class="grid-item" style="grid-column: span 2;"><span class="label">Full Address</span><span class="value">${getFullAddress(member.address)}</span></div>
          </div>

          <div class="section-title">Career & Educational Details</div>
          <div class="grid">
            <div class="grid-item"><span class="label">Highest Education</span><span class="value">${Array.isArray(profInfo.highestDegree) ? profInfo.highestDegree.join(", ") : profInfo.highestDegree || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Specialization Degree</span><span class="value">${Array.isArray(profInfo.degree) ? profInfo.degree.join(", ") : profInfo.degree || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Current Occupation</span><span class="value">${profInfo.occupation || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Annual Income</span><span class="value">${profInfo.annualIncome || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Organization Name</span><span class="value">${profInfo.organizationName || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Work Location</span><span class="value">${profInfo.employmentLocation || "N/A"}</span></div>
          </div>

          <div class="section-title">Family Heritage & Gotra Information</div>
          <div class="grid">
            <div class="grid-item"><span class="label">Father's Name</span><span class="value">${familyInfo.fatherName || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Father's Occupation</span><span class="value">${familyInfo.occupation || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Father's Native Thikana</span><span class="value">${familyInfo.fatherNativePlace || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Mother's Name</span><span class="value">${familyInfo.motherName || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Mother's Native Thikana</span><span class="value">${familyInfo.motherNativePlace || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Maternal (Nani) Gotra</span><span class="value">${familyInfo.maternalGotra || "N/A"}</span></div>
            <div class="grid-item" style="grid-column: span 2;"><span class="label">Siblings Information</span><span class="value">${familyInfo.siblings || "N/A"}</span></div>
          </div>

          <div class="section-title">Horoscope & Astro Information</div>
          <div class="grid">
            <div class="grid-item"><span class="label">Birth Place</span><span class="value">${horoInfo.birthPlace || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Birth Time</span><span class="value">${horoInfo.birthTime || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Manglik Status</span><span class="value">${horoInfo.isManglik || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Rashi / Nakshatra</span><span class="value">${horoInfo.rashi || "N/A"} / ${horoInfo.nakshatra || "N/A"}</span></div>
            <div class="grid-item"><span class="label">Nadi / Charan</span><span class="value">${horoInfo.nadi || "N/A"} &bull; ${horoInfo.charan || "N/A"}</span></div>
          </div>

          <div class="section-title">Grandparents & Ancestry Details</div>
          <div class="grid">
            <div class="grid-item"><span class="label">Paternal Grandfather (Dada Ji)</span><span class="value">${extFamily.grandFatherName || "N/A"} (${extFamily.grandFatherthikana || "Thikana N/A"})</span></div>
            <div class="grid-item"><span class="label">Paternal Grandmother (Dadi Ji)</span><span class="value">${extFamily.grandMotherName || "N/A"} (${extFamily.grandmotherthikana || "Thikana N/A"})</span></div>
            <div class="grid-item"><span class="label">Maternal Grandfather (Nana Ji)</span><span class="value">${extFamily.maternalGrandFatherName || "N/A"} (${extFamily.maternalGrandFatherthikana || "Thikana N/A"})</span></div>
            <div class="grid-item"><span class="label">Maternal Grandmother (Nani Ji)</span><span class="value">${extFamily.maternalGrandMotherName || "N/A"} (${extFamily.maternalGrandMotherthikana || "Thikana N/A"})</span></div>
          </div>

          ${member.additionalInfo ? `
            <div class="section-title">Additional Remarks / Bio</div>
            <p style="font-size: 13px; color: #444;">${member.additionalInfo}</p>
          ` : ""}

          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} &bull; Rajput Alliances Matrimonial Portal &bull; Confidential Document
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "500px" }}>
          <div className="spinner-border text-royal" role="status" style={{ width: "3.5rem", height: "3.5rem", color: "#59123B" }}>
            <span className="visually-hidden">Loading Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="main-content">
        <div className="alert alert-danger m-4">
          <h4>Profile Not Found</h4>
          <p>The profile details could not be retrieved from the database.</p>
          <Link to="/Members/Free-Members" className="btn btn-danger mt-2">Go Back</Link>
        </div>
      </div>
    );
  }

  /* Render Tabs Navigation */
  const tabs = [
    { id: "overview", label: "Overview", icon: <FaInfoCircle /> },
    { id: "basic", label: "Basic Details", icon: <FaUser /> },
    { id: "professional", label: "Career & Education", icon: <FaBriefcase /> },
    { id: "family", label: "Family Details", icon: <FaUsers /> },
    { id: "horoscope", label: "Horoscope", icon: <FaCompass /> },
    { id: "photos", label: `Photos (${photos.length})`, icon: <FaCamera /> },
    { id: "documents", label: `Documents (${docs.length})`, icon: <FaFileAlt /> }
  ];

  return (
    <div className="main-content">
      {/* Redesigned Stylesheet */}
      <style>{`
        .royal-member-header {
          background: linear-gradient(135deg, #59123B 0%, #3f0c2a 100%);
          border-radius: 16px;
          color: white;
          padding: 30px;
          margin-bottom: 24px;
          border-bottom: 4px solid #D4AF37;
          box-shadow: 0 8px 30px rgba(89, 18, 59, 0.15);
        }
        .royal-profile-img-wrap {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 4px solid #D4AF37;
          background: #59123B;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 3rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
          position: relative;
        }
        .royal-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .royal-sidebar-tabs {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(89, 18, 59, 0.05);
          border: 1px solid #f2e9ed;
        }
        .royal-tab-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #725D66;
          font-weight: 600;
          text-align: left;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          margin-bottom: 8px;
        }
        .royal-tab-btn:hover {
          background: #fdf4f8;
          color: #59123B;
        }
        .royal-tab-btn.active {
          background: #59123B;
          color: white;
          box-shadow: 0 4px 12px rgba(89, 18, 59, 0.2);
        }
        .royal-tab-btn.active svg {
          color: #D4AF37;
        }
        .royal-tab-btn svg {
          font-size: 1.1rem;
          transition: color 0.25s;
        }
        .royal-detail-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(89, 18, 59, 0.05);
          border: 1px solid #f2e9ed;
          min-height: 480px;
        }
        .royal-card-title {
          font-family: 'Playfair Display', serif;
          color: #59123B;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 24px;
          border-bottom: 2.5px solid #f2e9ed;
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .royal-meta-badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .rm-badge-approved { background: #dcfce7; color: #15803d; }
        .rm-badge-pending  { background: #fef3c7; color: #92400e; }
        .rm-badge-blocked  { background: #fee2e2; color: #dc2626; }
        .rm-badge-active   { background: #eff6ff; color: #1d4ed8; }
        .rm-badge-premium  { background: #fef9ec; border: 1px dashed #D4AF37; color: #c29202; }
        .rm-badge-free     { background: #f3f4f6; color: #4b5563; }

        .royal-grid-item {
          background: #ffffff;
          border-radius: 12px;
          padding: 16px 18px;
          border: 1px solid #f0e4ea;
          box-shadow: 0 2px 8px rgba(89, 18, 59, 0.04);
          height: 100%;
          transition: all 0.2s ease-in-out;
        }
        .royal-grid-item:hover {
          transform: translateY(-2px);
          border-color: #D4AF37;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.18);
        }
        .royal-item-lbl {
          font-size: 0.72rem;
          color: #8c6b79;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          letter-spacing: 0.6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .royal-item-lbl svg { color: #D4AF37; font-size: 0.95rem; flex-shrink: 0; }
        .royal-icon-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 14px 16px;
          border: 1px solid #f0e4ea;
          box-shadow: 0 2px 8px rgba(89, 18, 59, 0.04);
          display: flex;
          align-items: center;
          gap: 14px;
          height: 100%;
          transition: all 0.2s ease-in-out;
        }
        .royal-icon-card:hover {
          transform: translateY(-2px);
          border-color: #D4AF37;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.18);
        }
        .royal-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #f7eff3;
          color: #59123B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          flex-shrink: 0;
        }
        .royal-quick-bar {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .royal-quick-item {
          font-size: 0.88rem;
          background: rgba(255, 255, 255, 0.12);
          padding: 6px 14px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .relative-table th {
          background: #59123B !important;
          color: white !important;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
        }
        .relative-table td {
          font-size: 0.88rem;
          color: #3d1a2b;
          font-weight: 600;
          vertical-align: middle;
        }
        .relative-card-mobile {
          background: #faf7f8;
          border-radius: 12px;
          border: 1.5px solid #f2e6eb;
          padding: 14px;
          margin-bottom: 12px;
        }
        .photo-gallery-card {
          border: 1px solid #f2e6eb;
          border-radius: 12px;
          overflow: hidden;
          background: #faf7f8;
          padding: 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
        }
        .photo-gallery-card:hover {
          box-shadow: 0 8px 25px rgba(89, 18, 59, 0.12);
          border-color: #D4AF37;
        }
        .action-button-panel {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .btn-panel-action {
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-panel-approve { background: #15803d; color: white; }
        .btn-panel-approve:hover { background: #166534; transform: translateY(-1px); }
        .btn-panel-disapprove { background: #d97706; color: white; }
        .btn-panel-disapprove:hover { background: #b45309; transform: translateY(-1px); }
        .btn-panel-block { background: #dc2626; color: white; }
        .btn-panel-block:hover { background: #b91c1c; transform: translateY(-1px); }
        .btn-panel-unblock { background: #1d4ed8; color: white; }
        .btn-panel-unblock:hover { background: #1e40af; transform: translateY(-1px); }
        .btn-panel-delete { background: #f3f4f6; color: #4b5563; }
        .btn-panel-delete:hover { background: #dc2626; color: white; }
        .doc-preview-card {
          background: #faf7f8;
          border: 1.5px dashed #D4AF37;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .doc-preview-card:hover {
          background: #fdfafb;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
        }
        /* Custom Lightbox Modal */
        .royal-lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        .royal-lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
          position: relative;
          background: #111;
          border: 2px solid #D4AF37;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .royal-lightbox-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }
        .royal-lightbox-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #59123B;
          color: #D4AF37;
          border: 1px solid #D4AF37;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 10;
        }
      `}</style>

      {/* ── HEADER NAVIGATION & GENERAL CONTROLS ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/Members/Free-Members" className="btn btn-royal-outline d-inline-flex align-items-center gap-2">
            <FaArrowLeft /> Back to Members list
          </Link>
          <button
            onClick={handleDownloadPdf}
            className="btn d-inline-flex align-items-center gap-2"
            style={{ background: "#59123B", color: "#D4AF37", border: "1px solid #D4AF37", borderRadius: "10px", fontWeight: 700, padding: "10px 18px" }}
          >
            <FaDownload /> Download Biodata (PDF)
          </button>
        </div>
        <div className="action-button-panel">
          <button
            onClick={handleApproveStatus}
            disabled={actionLoading}
            className={`btn-panel-action ${member.isApproved ? "btn-panel-disapprove" : "btn-panel-approve"}`}
          >
            {member.isApproved ? <FaTimes /> : <FaCheck />}
            {member.isApproved ? "Disapprove Member" : "Approve Member"}
          </button>
          
          <button
            onClick={handleBlockStatus}
            disabled={actionLoading}
            className={`btn-panel-action ${member.isbloacked ? "btn-panel-unblock" : "btn-panel-block"}`}
          >
            <FaBan />
            {member.isbloacked ? "Unblock Member" : "Block Member"}
          </button>

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="btn-panel-action btn-panel-delete"
          >
            <FaTrash /> Delete Profile
          </button>
        </div>
      </div>

      {/* ── PROFILE MAIN BANNER ── */}
      <div className="royal-member-header">
        <div className="d-flex align-items-center flex-wrap gap-4">
          <div
            className="royal-profile-img-wrap"
            onClick={() => {
              const currentImg = getFileUrl(photos[imgIndex]?.url || member.avatar);
              if (currentImg) openLightbox(currentImg, `${member.firstName} ${member.lastName}`);
            }}
            style={{ cursor: "pointer" }}
            title="Click to view full photo"
          >
            {photos.length > 0 || member.avatar ? (
              <img src={getFileUrl(photos[imgIndex]?.url || member.avatar)} alt="Avatar" className="royal-profile-img" />
            ) : (
              `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase()
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <div className="d-flex align-items-center gap-3 flex-wrap mb-2">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: 0 }}>
                {member.firstName} {member.middleName} {member.lastName}
              </h2>
              <span className="badge-royal-gold" style={{ fontSize: "0.85rem", padding: "5px 12px" }}>
                ID: {member.martrId}
              </span>
            </div>
            
            <p style={{ color: "#f2e6eb", margin: "0 0 14px 0", fontSize: "0.98rem" }}>
              Profile created for <strong style={{ color: "#D4AF37" }}>{member.profilefor || "Self"}</strong> 
              &bull; Account role: <strong>{member.role || "User"}</strong>
            </p>

            <div className="d-flex flex-wrap gap-2">
              <span className={`royal-meta-badge ${member.isApproved ? "rm-badge-approved" : "rm-badge-pending"}`}>
                {member.isApproved ? "Approved" : "Pending Approval"}
              </span>
              <span className={`royal-meta-badge ${member.isbloacked ? "rm-badge-blocked" : "rm-badge-active"}`}>
                {member.isbloacked ? "Blocked" : "Active"}
              </span>
              <span className={`royal-meta-badge ${member.isSubscribed ? "rm-badge-premium" : "rm-badge-free"}`}>
                {member.isSubscribed ? <><FaCrown /> Premium</> : "Free Member"}
              </span>
            </div>

            <div className="royal-quick-bar">
              <span className="royal-quick-item">
                <FaCalendarAlt style={{ color: "#D4AF37" }} /> {getAge(member.dateOfBirth)} Years Old
              </span>
              <span className="royal-quick-item">
                <FaRulerVertical style={{ color: "#D4AF37" }} /> {formatHeight(member.height)}
              </span>
              <span className="royal-quick-item">
                <FaRing style={{ color: "#D4AF37" }} /> {member.maritalStatus || "Unmarried"}
              </span>
              <span className="royal-quick-item">
                <FaMapMarkerAlt style={{ color: "#D4AF37" }} /> {member.address?.city || "N/A"}, {member.address?.state || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION & DETAILS PANELS ── */}
      <div className="row">
        {/* Left Side Tab Navigation */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="royal-sidebar-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`royal-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="col-lg-9 col-md-8 mb-4">
          <div className="royal-detail-card">
            
            {/* 1️⃣ TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h4 className="royal-card-title"><FaInfoCircle /> Profile Telemetry & Overview</h4>
                <div className="row g-4 mb-4">
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaRegIdCard /> Matrimony ID</div>
                      <div className="royal-item-val">{member.martrId}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaCalendarAlt /> Born on</div>
                      <div className="royal-item-val">{formatDate(member.dateOfBirth)}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaHistory /> Total views</div>
                      <div className="royal-item-val">{member.view || 0} hits</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaHeart /> Request Sent</div>
                      <div className="royal-item-val">{member.reqSentCount || (Array.isArray(member.reqSent) ? member.reqSent.length : 0)} profiles</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaCheckCircle /> Verification Status</div>
                      <div className="royal-item-val" style={{ color: member.isApproved ? "#15803d" : "#ea580c" }}>
                        {member.isApproved ? "Fully Verified" : "Review Pending"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaUsers /> Family Thikana</div>
                      <div className="royal-item-val">{familyInfo.fatherNativePlace || familyInfo.familyLocation || member.address?.city || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaCalendarAlt /> Account Created</div>
                      <div className="royal-item-val">{formatDate(getCreatedDate(member))}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaHistory /> Last Login</div>
                      <div className="royal-item-val">{formatDate(member.lastLoginAt || getCreatedDate(member))}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Box */}
                <div className="p-4 rounded" style={{ background: "#faf7f8", border: "1.5px dashed #f2e6eb" }}>
                  <h5 style={{ color: "#59123B", fontWeight: 700, fontSize: "0.95rem" }} className="mb-2">Additional Remarks / Bio:</h5>
                  <p style={{ color: "#5c3d4a", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {member.additionalInfo || "No additional comments or bio details provided by the user."}
                  </p>
                </div>
              </div>
            )}

            {/* 2️⃣ TAB: BASIC DETAILS */}
            {activeTab === "basic" && (
              <div>
                <h4 className="royal-card-title"><FaUser /> Basic & Contact Information</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Full Name</div>
                      <div className="royal-item-val">{member.firstName} {member.middleName} {member.lastName}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Gender</div>
                      <div className="royal-item-val">{member.gender || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaEnvelope /> Email Address</div>
                      <div className="royal-item-val">{member.email || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaPhone /> Mobile Phone</div>
                      <div className="royal-item-val">{member.mobile || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaRulerVertical /> Height</div>
                      <div className="royal-item-val">{formatHeight(member.height)}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaWeight /> Weight (kg)</div>
                      <div className="royal-item-val">{member.weight ? `${member.weight} kg` : "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaRing /> Marital Status</div>
                      <div className="royal-item-val">{member.maritalStatus || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Full Address</div>
                      <div className="royal-item-val">{getFullAddress(member.address)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3️⃣ TAB: CAREER & EDUCATION */}
            {activeTab === "professional" && (
              <div>
                <h4 className="royal-card-title"><FaBriefcase /> Career & Educational Qualifications</h4>
                <div className="row g-3">
                  {/* Qualifications List */}
                  {Array.isArray(profInfo.qualificationsList) && profInfo.qualificationsList.length > 0 ? (
                    profInfo.qualificationsList.map((q, idx) => (
                      <React.Fragment key={`qual-${idx}`}>
                        <div className="col-md-6 mb-3">
                          <div className="royal-icon-card">
                            <div className="royal-icon-box"><FaGraduationCap /></div>
                            <div>
                              <div className="royal-item-lbl">QUALIFICATIONS #{idx + 1}</div>
                              <div className="royal-item-val">{q.qualification || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="royal-icon-card">
                            <div className="royal-icon-box"><FaBuilding /></div>
                            <div>
                              <div className="royal-item-lbl">INSTITUTION #{idx + 1}</div>
                              <div className="royal-item-val">{q.institution || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="col-md-6 mb-3">
                        <div className="royal-icon-card">
                          <div className="royal-icon-box"><FaGraduationCap /></div>
                          <div>
                            <div className="royal-item-lbl">HIGHEST EDUCATION</div>
                            <div className="royal-item-val">
                              {profInfo.qualifications ||
                                (Array.isArray(profInfo.highestDegree) ? profInfo.highestDegree.join(", ") : profInfo.highestDegree) ||
                                profInfo.education ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="royal-icon-card">
                          <div className="royal-icon-box"><FaBuilding /></div>
                          <div>
                            <div className="royal-item-lbl">INSTITUTION / COLLEGE</div>
                            <div className="royal-item-val">
                              {profInfo.institution ||
                                profInfo.college ||
                                (Array.isArray(profInfo.degree) ? profInfo.degree.join(", ") : profInfo.degree) ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Occupations List */}
                  {Array.isArray(profInfo.occupationsList) && profInfo.occupationsList.length > 0 ? (
                    profInfo.occupationsList.map((occ, idx) => (
                      <React.Fragment key={`occ-${idx}`}>
                        <div className="col-md-6 mb-3">
                          <div className="royal-icon-card">
                            <div className="royal-icon-box"><FaBriefcase /></div>
                            <div>
                              <div className="royal-item-lbl">CURRENT ROLE #{idx + 1}</div>
                              <div className="royal-item-val">{occ.occupation || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="royal-icon-card">
                            <div className="royal-icon-box"><FaBuilding /></div>
                            <div>
                              <div className="royal-item-lbl">COMPANY #{idx + 1}</div>
                              <div className="royal-item-val">{occ.company || occ.salary || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="col-md-6 mb-3">
                        <div className="royal-icon-card">
                          <div className="royal-icon-box"><FaBriefcase /></div>
                          <div>
                            <div className="royal-item-lbl">CURRENT OCCUPATION</div>
                            <div className="royal-item-val">{profInfo.professional || profInfo.occupation || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="royal-icon-card">
                          <div className="royal-icon-box"><FaBuilding /></div>
                          <div>
                            <div className="royal-item-lbl">ORGANIZATION / COMPANY</div>
                            <div className="royal-item-val">{profInfo.company || profInfo.organizationName || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Additional Professional Details */}
                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaMoneyBillWave /></div>
                      <div>
                        <div className="royal-item-lbl">ANNUAL INCOME / EARNINGS</div>
                        <div className="royal-item-val">{profInfo.annualIncome || profInfo.income || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaMapMarkerAlt /></div>
                      <div>
                        <div className="royal-item-lbl">EMPLOYMENT LOCATION</div>
                        <div className="royal-item-val">{profInfo.employmentLocation || profInfo.workLocation || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {profInfo.class && (
                    <div className="col-md-6 mb-3">
                      <div className="royal-icon-card">
                        <div className="royal-icon-box"><FaCrown /></div>
                        <div>
                          <div className="royal-item-lbl">CLASS</div>
                          <div className="royal-item-val">{profInfo.class}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4️⃣ TAB: FAMILY DETAILS */}
            {activeTab === "family" && (
              <div>
                <h4 className="royal-card-title"><FaUsers /> Family Heritage & Gotra Info</h4>
                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaShieldAlt /> Paternal Clan (Vansh)</div>
                      <div className="royal-item-val">{horoInfo.clan || member.clan || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaLandmark /> Paternal Gotra</div>
                      <div className="royal-item-val">{horoInfo.gotra || member.gotra || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaBookmark /> Sub-Clan / Khamp</div>
                      <div className="royal-item-val">{horoInfo.subclan || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaBookmark /> Maternal (Nani) Gotra</div>
                      <div className="royal-item-val">{familyInfo.maternalGotra || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaUser /> Father's Name</div>
                      <div className="royal-item-val">{familyInfo.fatherName || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaBriefcase /> Father's Occupation</div>
                      <div className="royal-item-val">{familyInfo.occupation || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaHome /> Father's Native Thikana</div>
                      <div className="royal-item-val">{familyInfo.fatherNativePlace || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaFemale /> Mother's Name</div>
                      <div className="royal-item-val">{familyInfo.motherName || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaBriefcase /> Mother's Occupation</div>
                      <div className="royal-item-val">{familyInfo.motherOccupation || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaMapMarkerAlt /> Mother's Native Thikana</div>
                      <div className="royal-item-val">{familyInfo.motherNativePlace || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaMapPin /> Family Thikana / Location</div>
                      <div className="royal-item-val">{familyInfo.familyLocation || member.address?.city || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaUsers /> Siblings Summary</div>
                      <div className="royal-item-val">{familyInfo.siblings || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaInfoCircle /> Additional Maternal Info</div>
                      <div className="royal-item-val">{familyInfo.additionalMaternal || "N/A"}</div>
                    </div>
                  </div>
                </div>

                {/* Brothers & Sisters Lineage Details (if available) */}
                {["elderBrother", "elderSister", "youngerBrother", "youngerSister"].some(
                  (k) => Array.isArray(familyInfo[k]) && familyInfo[k].length > 0
                ) && (
                  <div className="mt-4">
                    <h5 style={{ color: "#59123B", fontWeight: 700, fontSize: "1rem" }} className="mb-3">
                      <FaUsers style={{ color: "#D4AF37", marginRight: 8 }} /> Brothers & Sisters Details
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-striped relative-table border rounded">
                        <thead>
                          <tr>
                            <th>Relation</th>
                            <th>Name</th>
                            <th>Married To</th>
                            <th>Son / Daughter Of</th>
                            <th>Thikana</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: "elderBrother", label: "Elder Brother" },
                            { key: "elderSister", label: "Elder Sister" },
                            { key: "youngerBrother", label: "Younger Brother" },
                            { key: "youngerSister", label: "Younger Sister" },
                          ].map(({ key, label }) =>
                            Array.isArray(familyInfo[key]) &&
                            familyInfo[key].map((item, idx) => (
                              <tr key={`${key}-${idx}`}>
                                <td style={{ color: "#59123B", fontWeight: 700 }}>{label}</td>
                                <td>{item.name || "N/A"}</td>
                                <td>{item.marriedto || item.marriedTo || "N/A"}</td>
                                <td>{item.sonof || item.daughterof || item.daughterOf || "N/A"}</td>
                                <td>{item.thikana || "N/A"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Brief Family Intro Box */}
                <div className="mt-4 p-4 rounded" style={{ background: "#ffffff", border: "1.5px dashed #D4AF37", boxShadow: "0 2px 8px rgba(89, 18, 59, 0.04)" }}>
                  <h5 style={{ color: "#59123B", fontWeight: 700, fontSize: "0.95rem" }} className="mb-2">Brief Family Intro:</h5>
                  <p style={{ color: "#5c3d4a", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {familyInfo.familyInfo || "No details provided."}
                  </p>
                </div>
              </div>
            )}

            {/* 5️⃣ TAB: HOROSCOPE */}
            {activeTab === "horoscope" && (
              <div>
                <h4 className="royal-card-title"><FaCompass /> Zodiac & Horoscope Details</h4>
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCalendarAlt /></div>
                      <div>
                        <div className="royal-item-lbl">DATE OF BIRTH</div>
                        <div className="royal-item-val">{formatDate(member.dateOfBirth)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaHistory /></div>
                      <div>
                        <div className="royal-item-lbl">BIRTH TIME</div>
                        <div className="royal-item-val">{getBirthTime(horoInfo)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaMapMarkerAlt /></div>
                      <div>
                        <div className="royal-item-lbl">BIRTHPLACE</div>
                        <div className="royal-item-val">{horoInfo.birthplace || horoInfo.birthCity || horoInfo.birthPlace || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaLandmark /></div>
                      <div>
                        <div className="royal-item-lbl">GOTRA</div>
                        <div className="royal-item-val">{horoInfo.gotra || member.gotra || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">MANGLIK STATUS</div>
                        <div className="royal-item-val">{horoInfo.maglik || horoInfo.isManglik || horoInfo.manglik || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">RASHI</div>
                        <div className="royal-item-val">{horoInfo.rashi || horoInfo.zodiac || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">NAKSHATRA</div>
                        <div className="royal-item-val">{horoInfo.nakshatra || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">RELIGION</div>
                        <div className="royal-item-val">{horoInfo.religion || "Hindu"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">NADI</div>
                        <div className="royal-item-val">{horoInfo.nadi || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="royal-icon-card">
                      <div className="royal-icon-box"><FaCompass /></div>
                      <div>
                        <div className="royal-item-lbl">CHARAN</div>
                        <div className="royal-item-val">{horoInfo.charan || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7️⃣ TAB: PHOTOS ALBUM */}
            {activeTab === "photos" && (
              <div>
                <h4 className="royal-card-title"><FaCamera /> Photo Album ({photos.length})</h4>
                {photos.length > 0 ? (
                  <div className="row g-4">
                    {photos.map((ph, idx) => {
                      const photoUrl = getFileUrl(ph.url);
                      return (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={idx}>
                          <div className="photo-gallery-card">
                            <div style={{ position: "relative", overflow: "hidden", borderRadius: "8px" }}>
                              <img
                                src={photoUrl}
                                alt={`Profile attachment ${idx + 1}`}
                                className="img-fluid"
                                style={{ height: "180px", width: "100%", objectFit: "cover", cursor: "pointer" }}
                                onClick={() => openLightbox(photoUrl, `Photo #${idx + 1}`)}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  background: "rgba(0,0,0,0.6)",
                                  color: "#D4AF37",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
                                  cursor: "pointer"
                                }}
                                onClick={() => openLightbox(photoUrl, `Photo #${idx + 1}`)}
                              >
                                <FaExpand />
                              </div>
                            </div>
                            <div className="text-center mt-3 d-flex flex-column gap-2">
                              <button
                                onClick={() => setImgIndex(idx)}
                                className={`btn btn-sm ${imgIndex === idx ? "btn-royal" : "btn-outline-secondary"}`}
                                style={{ fontSize: "0.78rem", borderRadius: "20px" }}
                              >
                                {imgIndex === idx ? "Default Avatar" : "Set as Default Avatar"}
                              </button>
                              <a
                                href={photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="btn btn-sm btn-light d-inline-flex align-items-center justify-content-center gap-1"
                                style={{ fontSize: "0.75rem", color: "#59123B", fontWeight: 600 }}
                              >
                                <FaDownload /> Download Image
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="alert alert-info text-center p-4">
                    No extra photos uploaded for this profile.
                  </div>
                )}
              </div>
            )}

            {/* 8️⃣ TAB: DOCUMENTS & VERIFICATION */}
            {activeTab === "documents" && (
              <div>
                <h4 className="royal-card-title"><FaFileAlt /> Verification & Uploaded Documents ({docs.length})</h4>
                
                {docs.length > 0 ? (
                  <div className="row g-4 mb-4">
                    {docs.map((doc, idx) => {
                      const docUrl = getFileUrl(doc.url);
                      const isImage = doc.url && (doc.url.endsWith(".jpg") || doc.url.endsWith(".jpeg") || doc.url.endsWith(".png") || doc.url.endsWith(".webp"));

                      return (
                        <div className="col-md-6 col-lg-4" key={idx}>
                          <div className="doc-preview-card">
                            {isImage ? (
                              <div style={{ height: "140px", overflow: "hidden", borderRadius: "8px", marginBottom: "12px", background: "#eee" }}>
                                <img
                                  src={docUrl}
                                  alt={`Doc ${idx + 1}`}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                                  onClick={() => openLightbox(docUrl, `Document #${idx + 1}`)}
                                />
                              </div>
                            ) : (
                              <FaRegIdCard size={54} style={{ color: "#59123B" }} className="my-3 mx-auto" />
                            )}

                            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#3d1a2b" }} className="mb-1">
                              Verification Document #{idx + 1}
                            </div>
                            <p className="text-muted small mb-3">
                              File ID: {doc._id || idx + 1}
                            </p>

                            <div className="d-flex gap-2">
                              {isImage && (
                                <button
                                  onClick={() => openLightbox(docUrl, `Document #${idx + 1}`)}
                                  className="btn btn-sm btn-royal-outline flex-fill d-flex align-items-center justify-content-center gap-1"
                                  style={{ fontSize: "0.78rem" }}
                                >
                                  <FaEye /> Preview
                                </button>
                              )}
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="btn btn-sm btn-royal flex-fill d-flex align-items-center justify-content-center gap-1"
                                style={{ fontSize: "0.78rem", background: "#59123B", color: "#D4AF37", border: "1px solid #D4AF37" }}
                              >
                                <FaDownload /> Download File
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="alert alert-info text-center p-4">
                    No identification proofs or verification documents uploaded by this member.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL FOR IMAGES / DOCUMENTS ── */}
      {lightboxOpen && (
        <div className="royal-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="royal-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="royal-lightbox-close" onClick={() => setLightboxOpen(false)}>
              <FaTimes />
            </button>
            <div className="p-3 text-center style={{ color: '#D4AF37' }}">
              <h5 style={{ color: "#D4AF37", margin: "0 0 10px 0", fontFamily: "Playfair Display, serif" }}>{lightboxTitle}</h5>
            </div>
            <img src={lightboxSrc} alt={lightboxTitle} className="royal-lightbox-img" />
            <div className="p-3 text-center">
              <a
                href={lightboxSrc}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-sm"
                style={{ background: "#D4AF37", color: "#3B0000", fontWeight: 700, borderRadius: "20px" }}
              >
                <FaDownload /> Download High-Res File
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewMember;
