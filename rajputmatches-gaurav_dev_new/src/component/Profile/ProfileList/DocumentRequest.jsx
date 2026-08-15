import React, { useState, useEffect } from "react";
import "./ShortListedProfile.css";
import { FaChevronLeft, FaChevronRight, FaFileAlt } from "react-icons/fa";
import { useAuth } from "../../Layout/AuthContext";
import styles from "./RequestCard.module.css";
import femaleDefault from "../../../assets/images/female_default.png";
import maleDefault from "../../../assets/images/male_default.png";
import { useNavigate } from "react-router-dom";
import RequestCard from "./RequestCard";

function DocumentRequest() {
  const [activeTab, setActiveTab] = useState("requestSent");
  const { fetchUserData, updateData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [data, setData] = useState({ documentReqSent: [], documentReqReceived: [] });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const profilesPerPage = 4;

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedData = await fetchUserData("profile/documentrequests");
      if (!fetchedData || (!fetchedData.documentReqSent && !fetchedData.documentReqReceived)) {
        throw new Error("Invalid data format");
      }
      setData({
        documentReqSent: fetchedData.documentReqSent || [],
        documentReqReceived: fetchedData.documentReqReceived || [],
      });
      setProfiles(
        activeTab === "requestSent"
          ? fetchedData.documentReqSent || []
          : fetchedData.documentReqReceived || []
      );
    } catch (err) {
      setError("An error occurred while fetching document requests.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    const newProfiles =
      tab === "requestSent" ? data.documentReqSent : data.documentReqReceived;
    setProfiles(newProfiles);
    setCurrentPage(1);
    setStatusFilter("all");
  };

  const filterProfiles = (status) => {
    setStatusFilter(status);
    const source =
      activeTab === "requestSent" ? data.documentReqSent : data.documentReqReceived;
    if (status === "all") {
      setProfiles(source);
    } else {
      setProfiles(source.filter((p) => p.status === status));
    }
    setCurrentPage(1);
  };

  const getCurrentProfiles = () => {
    const start = (currentPage - 1) * profilesPerPage;
    return profiles.slice(start, start + profilesPerPage);
  };

  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  // ── Image / Action container ──────────────────────────────────
  function DocumentImageContainer({ profile, activeButton, status }) {
    const navigate = useNavigate();

    const handleAction = async (action, profileId) => {
      try {
        await updateData(`profile/document/${action}`, profileId, true);
        fetchData();
        refreshData();
      } catch (err) {
        console.error(`Error on document ${action}:`, err);
      }
    };

    const handleWithdraw = async (profileId) => {
      try {
        await updateData("profile/document/withdrawal", profileId, true);
        fetchData();
        refreshData();
      } catch (err) {
        console.error("Error withdrawing document request:", err);
      }
    };

    const photos = profile?.filesId?.photos || [];
    const avatar = photos.find((p) => p?.isAvatar) || photos[0];
    const defaultAvatar = profile?.gender === "Female" ? femaleDefault : maleDefault;

    const renderPlaceholderWithActions = (actionButtons = null) => (
      <div
        className="image-container"
        style={{ position: "relative", width: "100%", height: "175px", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", backgroundColor: "#fdf8f4", borderRadius: "8px", overflow: "hidden" }}
      >
        <img
          src={avatar?.url || defaultAvatar}
          className="img-fluid"
          alt="Profile"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: avatar?.url ? "cover" : "contain",
            objectPosition: "center",
          }}
        />
        {actionButtons && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            {actionButtons}
          </div>
        )}
      </div>
    );

    if (activeButton === "requestSent") {
      if (status === "pending") {
        return renderPlaceholderWithActions(
          <button
            className="btn btn-outline-danger btn-sm"
            style={{ 
              fontSize: "12px", 
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "6px"
            }}
            onClick={() => handleWithdraw(profile._id)}
          >
            Cancel Request
          </button>
        );
      } else if (status === "rejected") {
        return renderPlaceholderWithActions(
          <div style={{ textAlign: "center", width: "90%", margin: "0 auto" }}>
            <p className="m-0 mb-2 text-dark fw-bold" style={{ fontSize: "13px" }}>
              Request Rejected
            </p>
            <button
              className="btn btn-primary btn-sm w-100"
              style={{ 
                backgroundColor: "var(--royal-maroon)",
                borderColor: "var(--royal-maroon)",
                fontSize: "12px", 
                fontWeight: "600",
                padding: "6px 12px",
                borderRadius: "6px"
              }}
              onClick={() => updateData("profile/documentRequest", profile._id, true).then(refreshData)}
            >
              Resend Request
            </button>
          </div>
        );
      } else if (status === "accepted") {
        return renderPlaceholderWithActions(
          <p className="m-0 text-dark fw-bold" style={{ fontSize: "13px" }}>
            ✅ Access Granted
          </p>
        );
      }
      return renderPlaceholderWithActions(null);
    }

    if (activeButton === "requestReceived") {
      if (status === "pending") {
        return renderPlaceholderWithActions(null);
      } else if (status === "rejected") {
        return renderPlaceholderWithActions(
          <p className="m-0 text-dark fw-bold" style={{ fontSize: "13px" }}>
            Declined
          </p>
        );
      } else if (status === "accepted") {
        return renderPlaceholderWithActions(
          <p
            className="m-0 text-white fw-bold"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)", fontSize: "14px" }}
          >
            ✅ Access Granted
          </p>
        );
      }
    }

    return renderPlaceholderWithActions(null);
  }

  // ── Render ────────────────────────────────────────────────────
  const getStatusCount = (status, tabKey = activeTab) => {
    const list = tabKey === "requestReceived" ? (data?.documentReqReceived || []) : (data?.documentReqSent || []);
    if (status === "all") return list.length;
    return list.filter((p) => p?.status === status).length;
  };

  return (
    <div className="profileContainer">
      {/* Header */}
      <div className="profileListHeader">
        <div className="pagetitle" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaFileAlt style={{ color: "#7B1A1A" }} />
          Document Request
        </div>
      </div>

      {/* Tabs + filter */}
      <div className="row m-0 mb-3 p-0 bg-white">
        <div className="col-8 col-sm-9 col-md-10 d-flex p-0">
          {[
            { key: "requestSent",     label: "Request Sent",     count: data.documentReqSent.length },
            { key: "requestReceived", label: "Request Received",  count: data.documentReqReceived.length },
          ].map(({ key, label, count }) => (
            <div
              key={key}
              onClick={() => switchTab(key)}
              style={{
                backgroundColor: activeTab === key ? "#7B1A1A" : "transparent",
                color: activeTab === key ? "white" : "black",
              }}
              className="reqbtn"
            >
              {label} ({count})
            </div>
          ))}
        </div>

        <div className="col-4 col-sm-3 col-md-2 p-2" style={{ alignContent: "center" }}>
          <select
            className="form-select form-select-lg m-0"
            style={{
              color: "rgba(97,97,97,1)",
              borderRadius: "0%",
              border: "1px solid rgba(97,97,97,1)",
              padding: "0.5rem 1rem",
              fontFamily: "Open Sans, sans-serif",
              fontWeight: "600",
              fontSize: "clamp(12px,2vw,14px)",
            }}
            value={statusFilter}
            onChange={(e) => filterProfiles(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Sub-Status Pill Tabs: All | Accepted | Pending | Rejected */}
      <div className="d-flex gap-2 mb-3 px-2 flex-wrap">
        {[
          { id: "all", label: "All Requests" },
          { id: "accepted", label: "Accepted", color: "#198754" },
          { id: "pending", label: "Pending", color: "#d97706" },
          { id: "rejected", label: "Rejected", color: "#dc3545" },
        ].map((statusTab) => {
          const isActive = statusFilter === statusTab.id;
          const count = getStatusCount(statusTab.id);
          return (
            <button
              key={statusTab.id}
              onClick={() => filterProfiles(statusTab.id)}
              className="btn d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm"
              style={{
                backgroundColor: isActive ? (statusTab.color || "#7B1A1A") : "#ffffff",
                color: isActive ? "#ffffff" : "#444444",
                border: `1.5px solid ${isActive ? (statusTab.color || "#7B1A1A") : "#e2e8f0"}`,
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <span>{statusTab.label}</span>
              <span
                className="badge rounded-circle"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : (statusTab.color || "#7B1A1A"),
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  padding: "4px 8px"
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Profile cards */}
      {loading ? (
        <div className="pagetitle text-center">Loading...</div>
      ) : error ? (
        <div className="pagetitle text-center text-danger">{error}</div>
      ) : (
        <div className="row m-0 p-0">
          {getCurrentProfiles().length === 0 ? (
            <div className="pagetitle text-center">No Document Requests Found</div>
          ) : (
            getCurrentProfiles().map((entry) => (
              <RequestCard
                key={entry._id}
                profile={entry?.userId}
                status={entry?.status}
                requestType="document"
                ProfileImagerender={DocumentImageContainer}
                activeTab={activeTab}
                fetchData={fetchData}
                handlecheck={(id) => {
                  setProfiles((prev) => prev.filter((p) => (p.userId?._id || p.userId || p._id) !== id));
                  setData((prev) => ({
                    documentReqSent: (prev?.documentReqSent || []).filter((p) => (p.userId?._id || p.userId || p._id) !== id),
                    documentReqReceived: (prev?.documentReqReceived || []).filter((p) => (p.userId?._id || p.userId || p._id) !== id),
                  }));
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{ all: "unset", cursor: currentPage === 1 ? "default" : "pointer" }}
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`btn fw-bold d-flex align-items-center justify-content-center ${
                currentPage === idx + 1 ? "text-white" : "bg-white text-black"
              }`}
              style={{
                backgroundColor: "rgba(123,26,26,1)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                padding: 0,
              }}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ all: "unset", cursor: currentPage === totalPages ? "default" : "pointer" }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentRequest;
