import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useAuth } from "../../Layout/AuthContext";
import femaleDefault from "../../../assets/images/female_default.png";
import maleDefault from "../../../assets/images/male_default.png";
import styles from "./RequestCard.module.css";
import ProfileBoxCard from "./ProfileBoxCard";

function RequestImageContainer({ profile }) {
  const { updateData } = useAuth();

  const handlePhotoReq = async (profileId) => {
    try {
      const route = "profile/photoRequest";
      await updateData(route, profileId, true);
    } catch (error) {
      console.error("Error sending photo request:", error);
    }
  };

  const isPrivate = profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted";
  const photos = profile?.filesId?.photos || [];
  const defaultAvatar = profile?.gender === "Female" ? femaleDefault : maleDefault;

  if (isPrivate || photos.length === 0) {
    return (
      <div
        className="image-container"
        style={{ position: "relative", width: "100%", height: "14rem" }}
      >
        <img
          src={defaultAvatar}
          className="img-fluid m-auto"
          alt="Placeholder"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <div
          className={styles.vipSection}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <p className="m-0 mb-1">Send request for photos</p>
          <button
            className={styles.ctaButton}
            onClick={() => handlePhotoReq(profile?._id)}
          >
            Request image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "14rem",
        overflow: "hidden",
      }}
    >
      {photos.map((photo, index) => (
        <img
          key={photo?._id || index}
          src={photo?.url || placeholderImage}
          className={`img-fluid m-auto ${
            index === 0 ? "visible-image" : "hidden-image"
          }`}
          alt="Profile"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            zIndex: index === 0 ? 1 : 0,
            opacity: index === 0 ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

function ViewedProfile() {
  const { fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [profiles, setProfiles] = useState([]);

  const profilesPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(profiles?.length / profilesPerPage);

  const getProfilesForCurrentPage = () => {
    const startIdx = (currentPage - 1) * profilesPerPage;
    return profiles?.slice(startIdx, startIdx + profilesPerPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    try {
      const route = "profile/viewed";
      const data = await fetchUserData(route);

      if (data && Array.isArray(data?.visitedAt)) {
        setProfiles(data?.visitedAt);
      } else {
        console.error("Invalid data format");
        setProfiles([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setProfiles([]);
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

  const sortProfiles = (criteria) => {
    const sortedProfiles = [...profiles].sort((a, b) => {
      if (criteria === "age") {
        const ageA = calculateAge(a.dateOfBirth);
        const ageB = calculateAge(b.dateOfBirth);
        return sortDirection === "asc" ? ageA - ageB : ageB - ageA;
      } else if (criteria === "height") {
        const heightA = (a.height?.feet || 0) * 12 + (a.height?.inches || 0);
        const heightB = (b.height?.feet || 0) * 12 + (b.height?.inches || 0);
        return sortDirection === "asc" ? heightA - heightB : heightB - heightA;
      }
      return 0;
    });

    setProfiles(sortedProfiles);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortCriteria(criteria);
  };

  const handleCheck = (id) => {
    setProfiles(profiles.filter((profile) => profile._id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">Viewed Profile</div>
        <div className="filters">
          <div
            className="filterItem d-flex justify-content-between"
            onClick={() => sortProfiles("age")}
          >
            <span>Age</span>
            <span>
              {sortCriteria === "age" && sortDirection === "asc" ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </span>
          </div>
          <div
            className="filterItem d-flex justify-content-between"
            onClick={() => sortProfiles("height")}
          >
            <span>Height</span>
            <span>
              {sortCriteria === "height" && sortDirection === "asc" ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : profiles.length === 0 ? (
        <div className="pagetitle text-center">No Profiles Found</div>
      ) : (
        <>
          <div className="row mb-2 m-0 p-0">
            {getProfilesForCurrentPage().map((profile) => (
              <ProfileBoxCard
                key={profile._id}
                profile={profile}
                handleCheck={handleCheck}
                ProfileImagerender={RequestImageContainer}
              />
            ))}
          </div>
          <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <button
                style={{
                  all: "unset",
                  cursor: currentPage === 1 ? "default" : "pointer",
                }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`btn fw-bold d-flex align-items-center justify-content-center ${
                    currentPage === index + 1
                      ? "text-white"
                      : "bg-white text-black"
                  }`}
                  style={{
                    backgroundColor: "rgba(153, 37, 37, 1)",
                    width: "40px", // Adjust size as needed
                    height: "40px",
                    borderRadius: "50%", // Ensures circular shape
                    padding: 0,
                  }}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className=""
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
        </>
      )}
    </div>
  );
}

export default ViewedProfile;
