import React, { useEffect, useState } from "react";
import "./ShortListedProfile.css";
import ProfileCard from "./ProfileCard";
import placeholderImage from "../../../assets/images/blurimage.png";
import { useAuth } from "../../Layout/AuthContext";

export function RequestImageContainer({ profile }) {
  const isPrivate = profile?.filesId?.isPrivate && profile?.photoRequestStatus !== "accepted";
  const photos = profile?.filesId?.photos || [];
  if (isPrivate || photos.length === 0) {
    return (
      <div className="image-container">
        <img src={placeholderImage} alt="profile" className="profileImage" />
      </div>
    );
  }

  return (
    <div className="image-container">
      {photos.map((photo, index) => (
        <img
          key={photo?._id || index}
          src={photo?.url || placeholderImage}
          className="profileImage"
          alt="Profile"
        />
      ))}
    </div>
  );
}

const ShortlistedProfile = () => {
  const { fetchUserData, updateData } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ageSortOrder, setAgeSortOrder] = useState("");
  const [heightSortOrder, setHeightSortOrder] = useState("");

  // Function to sort profiles by Age
  const sortByAge = (order) => {
    let sortedProfiles = [...profiles].sort((a, b) => {
      const dateA = new Date(a?.profile?.dateOfBirth || 0);
      const dateB = new Date(b?.profile?.dateOfBirth || 0);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    setProfiles(sortedProfiles);
    setAgeSortOrder(order);
  };

  // Function to sort profiles by Height
  const sortByHeight = (order) => {
    let sortedProfiles = [...profiles].sort((a, b) => {
      const heightA = (a?.profile?.height?.feet || 0) * 12 + (a?.profile?.height?.inches || 0);
      const heightB = (b?.profile?.height?.feet || 0) * 12 + (b?.profile?.height?.inches || 0);
      return order === "asc" ? heightA - heightB : heightB - heightA;
    });

    setProfiles(sortedProfiles);
    setHeightSortOrder(order);
  };

  const fetchData = async () => {
    try {
      const route = "profile/show-shortlisted";
      let data = await fetchUserData(route);

      if (!data || !Array.isArray(data.shortlisted)) {
        setError("Invalid data format");
        return;
      }

      setProfiles(data.shortlisted);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "An unexpected error occurred while fetching profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!Array.isArray(profiles)) return;
    let route = "profile/shortlisted/delete";
    await updateData(route, id, true);
    fetchData();
  };

  const handleBookmark = async (id) => {
    if (!Array.isArray(profiles)) return;
    let route = "profile/shortlisted/edit";
    await updateData(route, id, true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="profileContainer">
        <div className="profileListHeader">
          <div className="pagetitle">Short Listed Profiles</div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div className="profileContainer">
        <div className="profileListHeader">
          <div className="pagetitle">Short Listed Profiles</div>
        </div>
        <div className="pagetitle text-center">No Profiles Found</div>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">Short Listed Profiles</div>
        <div className="filters">
          {/* Age Sorting Dropdown */}
          <div>
            <select
              className="filterItem"
              value={ageSortOrder}
              onChange={(e) => sortByAge(e.target.value)}
            >
              <option value="">Age</option>
              <option value="asc"> Descending</option>
              <option value="desc">Ascending</option>
            </select>
          </div>

          {/* Height Sorting Dropdown */}
          <div>
            <select
              className="filterItem"
              value={heightSortOrder}
              onChange={(e) => sortByHeight(e.target.value)}
            >
              <option value="">Height</option>
              <option value="asc"> Descending</option>
              <option value="desc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {profiles.map((element) => (
        <ProfileCard
          key={element._id}
          element={element}
          handleDelete={handleDelete}
          ProfileImagerender={RequestImageContainer}
          handleBookmark={handleBookmark}
        />
      ))}
    </div>
  );
};

export default ShortlistedProfile;
