import React, { useState, useEffect } from "react";
import "./ShortListedProfile.css";
import ProfileBoxCard from "./ProfileBoxCard";
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

export function RequestImageContainer({ profile }) {
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

function PeopleVisited() {
  const { fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("");
  const [sortDirection, setSortDirection] = useState({
    age: "asc",
    height: "asc",
  });
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

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
      const route = "profile/visited";
      const data = await fetchUserData(route);

      if (data && Array.isArray(data.viewedBy)) {
        setProfiles(data.viewedBy);
      } else {
        console.error("Invalid data format", data);
        setProfiles([]);
      }
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

  const getHeightInInches = (height) => {
    return (height?.feet || 0) * 12 + (height?.inches || 0);
  };

  const sortProfiles = (criteria) => {
    const direction = sortDirection[criteria];
    const sortedProfiles = [...profiles].sort((a, b) => {
      if (criteria === "age") {
        return direction === "asc"
          ? calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth)
          : calculateAge(b.dateOfBirth) - calculateAge(a.dateOfBirth);
      }
      if (criteria === "height") {
        return direction === "asc"
          ? getHeightInInches(a.height) - getHeightInInches(b.height)
          : getHeightInInches(b.height) - getHeightInInches(a.height);
      }
      return 0;
    });

    setProfiles(sortedProfiles);
    setSortCriteria(criteria);
    setSortDirection((prev) => ({
      ...prev,
      [criteria]: direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCheck = (id) => {
    setProfiles((prev) => prev.filter((profile) => (profile._id || profile.profile?._id || profile.userId?._id) !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">People visited my profile</div>
        <div className="filters">
          <div
            className="filterItem d-flex justify-content-between"
            onClick={() => sortProfiles("age")}
          >
            <span>Age</span>
            <span>
              {sortCriteria === "age" && sortDirection.age === "asc" ? (
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
              {sortCriteria === "height" && sortDirection.height === "asc" ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
                fetchData={fetchData}
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

export default PeopleVisited;
