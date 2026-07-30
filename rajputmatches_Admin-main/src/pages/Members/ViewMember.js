import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft, FaCheck, FaTimes, FaBan, FaTrash,
  FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaRulerVertical, FaWeight, FaRing, FaBriefcase, FaGraduationCap,
  FaFileAlt, FaDownload, FaCompass, FaRegIdCard, FaHistory,
  FaChevronRight, FaChevronLeft, FaInfoCircle, FaHeart, FaUsers,
  FaCrown, FaCheckCircle, FaUsersCog
} from "react-icons/fa";

const BASE_URL = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");

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

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  const domain = BASE_URL.replace(/\/admin$/, "");
  return `${domain}/${avatar}`;
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
  const { updateData } = useAuth();

  /* State */
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /* Document Modal/Carousel */
  const [imgIndex, setImgIndex] = useState(0);

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
        toast.error("Member profile data nahi mila.");
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
      toast.success(res.data?.message || "Status updated successfully!");
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

  /* Extract Photo & Doc Lists */
  const photos = member?.filesId?.photos || [];
  const docs = member?.filesId?.documents || [];
  const familyInfo = member?.familydetailsId || member?.familyDetails || {};
  const horoInfo = member?.HoroscopicId || {};
  const profInfo = member?.profdetailsId || {};
  const extFamily = member?.paternaldetails || {};

  /* Render Tabs Navigation */
  const tabs = [
    { id: "overview", label: "Overview", icon: <FaInfoCircle /> },
    { id: "basic", label: "Basic Details", icon: <FaUser /> },
    { id: "professional", label: "Career & Education", icon: <FaBriefcase /> },
    { id: "family", label: "Family Details", icon: <FaUsers /> },
    { id: "horoscope", label: "Horoscope", icon: <FaCompass /> },
    { id: "paternal", label: "Relatives & Lineage", icon: <FaUsersCog /> },
    { id: "documents", label: `Documents (${docs.length})`, icon: <FaFileAlt /> }
  ];

  /* UI Renders based on active tab */
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
          background: #faf7f8;
          border-radius: 12px;
          padding: 16px 20px;
          border: 1px solid #f2e6eb;
          height: 100%;
          transition: transform 0.2s, border-color 0.2s;
        }
        .royal-grid-item:hover {
          transform: translateY(-1px);
          border-color: rgba(212, 175, 55, 0.3);
        }
        .royal-item-lbl {
          font-size: 0.75rem;
          color: #9A7888;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .royal-item-lbl svg { color: #D4AF37; }
        .royal-item-val {
          font-size: 1rem;
          color: #3d1a2b;
          font-weight: 700;
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
          border: 1px dashed #D4AF37;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s;
        }
        .doc-preview-card:hover {
          background: #fdfafb;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.1);
        }
      `}</style>

      {/* ── HEADER NAVIGATION & GENERAL CONTROLS ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <Link to="/Members/Free-Members" className="btn btn-royal-outline d-inline-flex align-items-center gap-2">
          <FaArrowLeft /> Back to Members list
        </Link>
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
          <div className="royal-profile-img-wrap">
            {photos.length > 0 ? (
              <img src={getAvatarUrl(photos[imgIndex]?.url || member.avatar)} alt="Avatar" className="royal-profile-img" />
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
                      <div className="royal-item-val">{member.reqSentCount || 0} profiles</div>
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
                      <div className="royal-item-val">{familyInfo.familyLocation || member.address?.city || "N/A"}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Box */}
                <div className="p-4 rounded" style={{ background: "#faf7f8", border: "1.5px dashed #f2e6eb" }}>
                  <h5 style={{ color: "#59123B", fontWeight: 700, fontSize: "0.95rem" }} className="mb-2">Additional Remarks:</h5>
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
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaGraduationCap /> Highest Education</div>
                      <div className="royal-item-val">
                        {Array.isArray(profInfo.highestDegree) 
                          ? profInfo.highestDegree.join(", ") 
                          : profInfo.highestDegree || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Specialization Degree</div>
                      <div className="royal-item-val">
                        {Array.isArray(profInfo.degree) 
                          ? profInfo.degree.join(", ") 
                          : profInfo.degree || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaBriefcase /> Current Occupation</div>
                      <div className="royal-item-val">{profInfo.occupation || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Annual Income / Earnings</div>
                      <div className="royal-item-val">{profInfo.annualIncome || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Organization / Office Name</div>
                      <div className="royal-item-val">{profInfo.organizationName || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl"><FaMapMarkerAlt /> Employment Location</div>
                      <div className="royal-item-val">{profInfo.employmentLocation || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4️⃣ TAB: FAMILY DETAILS */}
            {activeTab === "family" && (
              <div>
                <h4 className="royal-card-title"><FaUsers /> Family Heritage & Gotra Info</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Father's Name</div>
                      <div className="royal-item-val">{familyInfo.fatherName || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Father's Occupation</div>
                      <div className="royal-item-val">{familyInfo.occupation || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Father's Native Thikana</div>
                      <div className="royal-item-val">{familyInfo.fatherNativePlace || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Mother's Name</div>
                      <div className="royal-item-val">{familyInfo.motherName || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Mother's Native Thikana</div>
                      <div className="royal-item-val">{familyInfo.motherNativePlace || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Maternal (Nani) Gotra</div>
                      <div className="royal-item-val">{familyInfo.maternalGotra || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Siblings Details</div>
                      <div className="royal-item-val">{familyInfo.siblings || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Additional Maternal Info</div>
                      <div className="royal-item-val">{familyInfo.additionalMaternal || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-4 rounded" style={{ background: "#faf7f8", border: "1.5px dashed #f2e6eb" }}>
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
                <h4 className="royal-card-title"><FaCompass /> Horoscopic / Astro Details</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Birth Place (Shehar)</div>
                      <div className="royal-item-val">{horoInfo.birthPlace || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Birth Time (Samay)</div>
                      <div className="royal-item-val">{horoInfo.birthTime || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Manglik status</div>
                      <div className="royal-item-val">{horoInfo.isManglik || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Rashi</div>
                      <div className="royal-item-val">{horoInfo.rashi || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Nakshatra</div>
                      <div className="royal-item-val">{horoInfo.nakshatra || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Nadi</div>
                      <div className="royal-item-val">{horoInfo.nadi || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Devak / Gan</div>
                      <div className="royal-item-val">{horoInfo.gan || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Charan</div>
                      <div className="royal-item-val">{horoInfo.charan || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6️⃣ TAB: PATERNAL & RELATIVES */}
            {activeTab === "paternal" && (
              <div>
                <h4 className="royal-card-title"><FaUsersCog /> Grandparents & Extended Lineage</h4>
                
                {/* Grandparents Block */}
                <h5 style={{ color: "#59123B", fontWeight: 700 }} className="mb-3">Paternal & Maternal Grandparents</h5>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Dada Ji (Grandfather)</div>
                      <div className="royal-item-val">{extFamily.grandFatherName || "N/A"}</div>
                      {extFamily.grandFathersonOf && <div style={{ fontSize: "0.82rem", color: "#9A7888" }} className="mt-1">Son of: {extFamily.grandFathersonOf}</div>}
                      {extFamily.grandFatheroccupation && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Occupation: {extFamily.grandFatheroccupation}</div>}
                      {extFamily.grandFatherthikana && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Thikana: {extFamily.grandFatherthikana}</div>}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Dadi Ji (Grandmother)</div>
                      <div className="royal-item-val">{extFamily.grandMotherName || "N/A"}</div>
                      {extFamily.grandMotherdaughterOf && <div style={{ fontSize: "0.82rem", color: "#9A7888" }} className="mt-1">Daughter of: {extFamily.grandMotherdaughterOf}</div>}
                      {extFamily.grandmotherthikana && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Thikana: {extFamily.grandmotherthikana}</div>}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Nana Ji (Maternal Grandfather)</div>
                      <div className="royal-item-val">{extFamily.maternalGrandFatherName || "N/A"}</div>
                      {extFamily.maternalGrandFathersonOf && <div style={{ fontSize: "0.82rem", color: "#9A7888" }} className="mt-1">Son of: {extFamily.maternalGrandFathersonOf}</div>}
                      {extFamily.maternalGrandFatheroccupation && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Occupation: {extFamily.maternalGrandFatheroccupation}</div>}
                      {extFamily.maternalGrandFatherthikana && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Thikana: {extFamily.maternalGrandFatherthikana}</div>}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="royal-grid-item">
                      <div className="royal-item-lbl">Nani Ji (Maternal Grandmother)</div>
                      <div className="royal-item-val">{extFamily.maternalGrandMotherName || "N/A"}</div>
                      {extFamily.maternalGrandMotherdaughterOf && <div style={{ fontSize: "0.82rem", color: "#9A7888" }} className="mt-1">Daughter of: {extFamily.maternalGrandMotherdaughterOf}</div>}
                      {extFamily.maternalGrandMotherthikana && <div style={{ fontSize: "0.82rem", color: "#9A7888" }}>Thikana: {extFamily.maternalGrandMotherthikana}</div>}
                    </div>
                  </div>
                </div>

                {/* Relatives Arrays Block */}
                <h5 style={{ color: "#59123B", fontWeight: 700 }} className="mb-3">Aunts, Uncles & Relatives Directory</h5>
                
                {/* Check if any relatives arrays have items */}
                {["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"].some(key => Array.isArray(extFamily[key]) && extFamily[key].length > 0) ? (
                  <>
                    {/* Desktop Table View */}
                    <div className="table-responsive d-none d-lg-block">
                      <table className="table table-striped relative-table border">
                        <thead>
                          <tr>
                            <th>Relation</th>
                            <th>Relative's Name</th>
                            <th>Married To</th>
                            <th>Son / Daughter of</th>
                            <th>Thikana (Address)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"].map((relKey) => 
                            Array.isArray(extFamily[relKey]) && extFamily[relKey].map((person, idx) => (
                              <tr key={`${relKey}-${idx}`}>
                                <td style={{ color: "#59123B", fontWeight: 700 }}>
                                  {relKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                </td>
                                <td>{person.name || "N/A"}</td>
                                <td>{person.marriedto || person.marriedTo || "N/A"}</td>
                                <td>{person.sonof || person.daughterof || person.daughterOf || "N/A"}</td>
                                <td>{person.thikana || "N/A"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="d-lg-none">
                      {["badePapa", "kakosa", "bhuasa", "mamosa", "masisa"].map((relKey) => 
                        Array.isArray(extFamily[relKey]) && extFamily[relKey].map((person, idx) => (
                          <div className="relative-card-mobile" key={`${relKey}-${idx}`}>
                            <div style={{ color: "#59123B", fontWeight: 700, borderBottom: "1px solid #f2e6eb", paddingBottom: 6 }} className="mb-2">
                              {relKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </div>
                            <div className="mb-1"><strong>Name:</strong> {person.name || "N/A"}</div>
                            <div className="mb-1"><strong>Married to:</strong> {person.marriedto || person.marriedTo || "N/A"}</div>
                            <div className="mb-1"><strong>Son/Daughter Of:</strong> {person.sonof || person.daughterof || person.daughterOf || "N/A"}</div>
                            <div className="mb-1"><strong>Thikana:</strong> {person.thikana || "N/A"}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted p-3 bg-light rounded text-center">No uncles, aunts or maternal family listings declared.</p>
                )}
              </div>
            )}

            {/* 7️⃣ TAB: DOCUMENTS & PHOTO ATTACHMENTS */}
            {activeTab === "documents" && (
              <div>
                <h4 className="royal-card-title"><FaFileAlt /> Uploaded Documents & ID Verifications</h4>
                
                {/* Verification Documents Grid */}
                {docs.length > 0 ? (
                  <div className="row mb-4">
                    {docs.map((doc, idx) => (
                      <div className="col-md-6 col-lg-4 mb-3" key={idx}>
                        <div className="doc-preview-card">
                          <FaRegIdCard size={48} style={{ color: "#59123B" }} className="mb-3" />
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#3d1a2b" }} className="mb-1">
                            Document #{idx + 1}
                          </div>
                          <p className="text-muted small mb-3">System file upload id: {doc._id || "N/A"}</p>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-royal-outline w-100 d-flex align-items-center justify-content-center gap-2">
                            <FaDownload /> Download / View File
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info text-center p-4">
                    No identification proofs or documents uploaded by this member.
                  </div>
                )}

                {/* Additional Photos Section */}
                <h5 style={{ color: "#59123B", fontWeight: 700 }} className="mb-3">Complete Photo Album ({photos.length})</h5>
                {photos.length > 0 ? (
                  <div className="row">
                    {photos.map((ph, idx) => (
                      <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={idx}>
                        <div className="photo-gallery-card">
                          <img
                            src={getAvatarUrl(ph.url)}
                            alt={`Profile attachment ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "160px", width: "100%", objectFit: "cover", cursor: "pointer" }}
                            onClick={() => setImgIndex(idx)}
                          />
                          <div className="text-center mt-2">
                            <button
                              onClick={() => setImgIndex(idx)}
                              className={`btn btn-sm ${imgIndex === idx ? "btn-royal" : "btn-light"}`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {imgIndex === idx ? "Default Avatar" : "Select as Avatar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center p-3 bg-light rounded">No extra images uploaded.</p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMember;
