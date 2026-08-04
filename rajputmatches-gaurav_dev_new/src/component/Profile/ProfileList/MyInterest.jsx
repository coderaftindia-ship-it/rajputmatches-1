import React, { useState, useEffect } from "react";
import "./ShortListedProfile.css";
import MyInterestCard from "./MyInterestCard";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoImageSharp } from "react-icons/io5";
import { useAuth } from "../../Layout/AuthContext";
import styles from "./RequestCard.module.css";
import { useNavigate } from "react-router-dom";
import femaleDefault from "../../../assets/images/female_default.png";
import maleDefault from "../../../assets/images/male_default.png";

function MyInterest() {
  const [activeTab, setActiveTab] = useState("requestSent");
  const [currentStatusTab, setCurrentStatusTab] = useState("all");
  const { fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [data, setData] = useState({ reqSent: [], reqReceived: [] });
  const [error, setError] = useState(null);
  const [sortCriteria] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const profilesPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const totalPages = Math.ceil(profiles?.length / profilesPerPage);

  const getProfilesForCurrentPage = () => {
    const startIdx = (currentPage - 1) * profilesPerPage;
    return profiles?.slice(startIdx, startIdx + profilesPerPage);
  };

  const getStatusCount = (status, tabKey = activeTab) => {
    const list = tabKey === "requestReceived" ? (data?.reqReceived || []) : (data?.reqSent || []);
    if (status === "all") return list.length;
    return list.filter((p) => p?.status === status).length;
  };

  const handleStatusTabChange = (status) => {
    setCurrentStatusTab(status);
    let list = activeTab === "requestReceived" ? [...(data?.reqReceived || [])] : [...(data?.reqSent || [])];
    if (status !== "all") {
      list = list.filter((profile) => profile?.status === status);
    }
    setProfiles(list);
    setCurrentPage(1);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const route = "profile/myrequests";
      const fetchedData = await fetchUserData(route);
      if (!fetchedData || !fetchedData.reqSent || !fetchedData.reqReceived) {
        throw new Error("Invalid data format");
      }
      setData(fetchedData);
      let list = activeTab === "requestSent" ? fetchedData.reqSent : fetchedData.reqReceived;
      if (currentStatusTab !== "all") {
        list = list.filter((p) => p?.status === currentStatusTab);
      }
      setProfiles(list);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateHeightInInches = (profile) => {
    if (!profile?.height) return 0;
    return (profile.height.feet || 0) * 12 + (profile.height.inches || 0);
  };

  const filterAndSortProfiles = (status, criteria) => {
    setCurrentStatusTab(status);
    let filteredProfiles =
      activeTab === "requestReceived"
        ? [...(data.reqReceived || [])]
        : [...(data.reqSent || [])];

    if (status !== "all") {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.status === status
      );
    }

    if (criteria && sortDirection.criteria === criteria) {
      const direction = sortDirection.direction === "asc" ? 1 : -1;

      filteredProfiles.sort((a, b) => {
        if (criteria === "age") {
          return (
            direction *
            (calculateAge(a.userId.dateOfBirth) -
              calculateAge(b.userId.dateOfBirth))
          );
        } else if (criteria === "height") {
          return (
            direction *
            (calculateHeightInInches(a.userId) -
              calculateHeightInInches(b.userId))
          );
        }
        return 0;
      });
    }

    setProfiles(filteredProfiles);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentStatusTab("all");
    const list = tab === "requestSent" ? [...(data?.reqSent || [])] : [...(data?.reqReceived || [])];
    setProfiles(list);
    setCurrentPage(1);
  };

  function RequestImageContainer({ profile, activeButton, status }) {
    const { updateData } = useAuth();
    const navigate = useNavigate();
    const totalPhotos = profile?.filesId?.totalPhotos;

    const handleViewimage = (profileId) => {
      navigate(`view/images/${profileId}`);
    };

    const handlePhotoReq = async (profileId) => {
      try {
        await updateData("profile/photoRequest", profileId, true);
        if (fetchData) fetchData();
      } catch (error) {
        console.error("Error sending photo request:", error);
      }
    };

    const defaultImg = profile?.gender === "Female" ? femaleDefault : maleDefault;

    const renderEmptyState = (actionButtons = null) => (
      <div className="image-container" style={{ position: "relative", width: "100%", height: "175px", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", backgroundColor: "#fdf8f4", borderRadius: "8px", overflow: "hidden" }}>
        <img
          src={defaultImg}
          className="img-fluid"
          alt="Placeholder"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />

        <span
          style={{
            position: "absolute",
            bottom: "0%",
            right: "0%",
            color: "white",
            backgroundColor: "black",
            padding: "3px 5px",
            zIndex: "20",
            fontFamily: "Open Sans, sans-serif",
          }}
          onClick={() => {
            handleViewimage(profile._id);
          }}
        >
          <IoImageSharp size={15} color="white" />
          <span style={{ color: "white" }} className="p-1">
            0{totalPhotos}
          </span>
        </span>
        <div
          className={styles.vipSection}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            padding: "0.5rem",
            width: "90%",
          }}
        >
          {actionButtons}
        </div>
      </div>
    );

    const isPrivate = !!profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted";
    const photos = profile?.filesId?.photos || [];

    // If private and not accepted photo request, or no photos at all
    if (isPrivate || photos.length === 0) {
      if (isPrivate) {
        const photoReqStatus = profile?.photoRequestStatus;
        if (photoReqStatus === "pending") {
          return renderEmptyState(
            <span
              className="badge bg-warning text-dark px-2 py-1 fw-bold"
              style={{ fontSize: "12px" }}
            >
              Request Pending
            </span>
          );
        } else if (photoReqStatus === "rejected") {
          return renderEmptyState(
            <div style={{ textAlign: "center" }}>
              <p
                className="m-0 mb-1 text-white fw-bold"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)", fontSize: "12px" }}
              >
                Request Rejected
              </p>
              <button
                className={styles.ctaButton}
                onClick={() => handlePhotoReq(profile._id)}
              >
                Resend Request
              </button>
            </div>
          );
        } else {
          return renderEmptyState(
            <button
              className={styles.ctaButton}
              onClick={() => handlePhotoReq(profile._id)}
            >
              Request Photo
            </button>
          );
        }
      }
      return renderEmptyState(null);
    }

    // Show single best photo (avatar first, else first photo)
    const avatar = photos.find((p) => p?.isAvatar) || photos[0];

    return (
      <div className="image-container" style={{ position: "relative", width: "100%", height: "175px", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", backgroundColor: "#fdf8f4", borderRadius: "8px", overflow: "hidden" }}>
        <img
          src={avatar?.url}
          className="img-fluid"
          alt="Profile"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", borderRadius: "6px" }}
        />
        <span
          style={{
            position: "absolute",
            bottom: "0%",
            right: "0%",
            color: "white",
            backgroundColor: "black",
            padding: "3px 5px",
            zIndex: "20",
            fontFamily: "Open Sans, sans-serif",
          }}
          onClick={() => { handleViewimage(profile._id); }}
        >
          <IoImageSharp size={15} color="white" />
          <span style={{ color: "white", fontSize: "14px" }} className="p-1">
            0{totalPhotos}
          </span>
        </span>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  if (loading) {
    return <div className="profileContainer">Loading...</div>;
  }

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">My Interests</div>
        {/* <div className="filters">
          {["age", "height"].map((criteria) => (
            <div
              key={criteria}
              className="filterItem d-flex justify-content-between"
              onClick={() => setSortDirection(criteria)}
            >
              <span>
                {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
              </span>
              <span>
                {sortCriteria === criteria && sortDirection === "asc" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </span>
            </div>
          ))}
        </div> */}
        <div className="filters">
          {["age", "height"].map((criteria) => (
            <select
              key={criteria}
              value={
                sortDirection.criteria === criteria
                  ? sortDirection.direction
                  : "asc"
              }
              onChange={(e) =>
                setSortDirection({ criteria, direction: e.target.value })
              }
              className="form-select form-select-lg p-2 filterItem"
            >
              <option value="asc">
                {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
              </option>
              <option value="asc">Increasing</option>
              <option value="desc">Decreasing</option>
            </select>
          ))}
        </div>
      </div>

      <div className="row m-0 mb-3 p-0 bg-white">
        <div className="col-8 col-sm-9 col-md-10 d-flex p-0">
          {["requestSent", "requestReceived"].map((tab) => (
            <div
              key={tab}
              onClick={() => switchTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#991c1c" : "transparent",
                color: activeTab === tab ? "white" : "black",
              }}
              className="reqbtn"
            >
              {tab === "requestSent" 
                ? `Request Sent (${data?.reqSent?.length || 0})` 
                : `Request Received (${data?.reqReceived?.length || 0})`}
            </div>
          ))}
        </div>
        <div
          className="col-4 col-sm-3 col-md-2 p-2"
          style={{ alignContent: "center" }}
        >
          <select
            className="form-select form-select-lg m-0"
            value={currentStatusTab}
            style={{
              color: "rgba(97, 97, 97, 1)",
              borderRadius: "0%",
              border: "1px solid rgba(97, 97, 97, 1)",
              padding: "0.5rem 1rem",
              fontFamily: "Open Sans, sans-serif",
              fontWeight: "600",
              fontSize: "clamp(8px, 11px, 14px)",
              outline: "none",
              wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            aria-label="form-select-lg example"
            onChange={(e) =>
              filterAndSortProfiles(e.target.value, sortCriteria)
            }
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
          const isActive = currentStatusTab === statusTab.id;
          const count = getStatusCount(statusTab.id);
          return (
            <button
              key={statusTab.id}
              onClick={() => handleStatusTabChange(statusTab.id)}
              className="btn d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm"
              style={{
                backgroundColor: isActive ? (statusTab.color || "#991c1c") : "#ffffff",
                color: isActive ? "#ffffff" : "#444444",
                border: `1.5px solid ${isActive ? (statusTab.color || "#991c1c") : "#e2e8f0"}`,
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
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : (statusTab.color || "#991c1c"),
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

      <div className="row m-0 p-0">
        {getProfilesForCurrentPage().length === 0 ? (
          <div className="pagetitle text-center">No Profiles Found</div>
        ) : (
          getProfilesForCurrentPage().map((profile) => (
            <MyInterestCard
              key={profile._id}
              profile={profile?.userId}
              status={profile?.status}
              activeTab={activeTab}
              ProfileImagerender={RequestImageContainer}
              fetchData={fetchData}
            />
          ))
        )}
      </div>

      <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              all: "unset",
              cursor: currentPage === 1 ? "default" : "pointer",
            }}
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`btn fw-bold d-flex align-items-center justify-content-center ${
                currentPage === index + 1 ? "text-white" : "bg-white text-black"
              }`}
              style={{
                backgroundColor: "rgba(153, 37, 37, 1)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                padding: 0,
              }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{
              all: "unset",
              cursor: currentPage === totalPages ? "default" : "pointer",
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyInterest;
