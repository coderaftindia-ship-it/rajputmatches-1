import React, { useState, useEffect } from "react";
import MyInterestCard from "./MyInterestCard";
import Pagination from "./components/Pagination";
import SortFilters from "./components/SortFilters";
import StatusFilter from "./components/StatusFilter";
import TabSwitcher from "./components/TabSwitcher";
import { useProfileList } from "./hooks/useProfileList";
import { useSorting } from "./hooks/useSorting";
import { useAuth } from "../../Layout/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoImageSharp } from "react-icons/io5";
import placeholderImage from "../../../assets/images/blurimage.png";
import styles from "./RequestCard.module.css";
import "./ShortListedProfile.css";

function MyInterest() {
  const [activeTab, setActiveTab] = useState("requestSent");
  const [allData, setAllData] = useState({ reqSent: [], reqReceived: [] });
  const { updateData } = useAuth();
  const navigate = useNavigate();

  // Use custom hook for profile list management
  const {
    profiles,
    setProfiles,
    loading,
    currentPage,
    totalPages,
    getCurrentPageProfiles,
    goToPage,
    nextPage,
    prevPage,
    refreshData,
  } = useProfileList("profile/myrequests", null, 4);

  // Use custom hook for sorting
  const { sortConfig, setSortDirection } = useSorting(profiles, setProfiles);

  // Tab configuration
  const tabs = [
    { value: "requestSent", label: "Request Sent" },
    { value: "requestReceived", label: "Request Received" },
  ];

  // Handle tab switch
  const switchTab = (tab) => {
    setActiveTab(tab);
    const newProfiles = tab === "requestSent" ? allData.reqSent : allData.reqReceived;
    setProfiles(newProfiles);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    const sourceData = activeTab === "requestSent" ? allData.reqSent : allData.reqReceived;
    
    if (status === "all") {
      setProfiles(sourceData);
    } else {
      const filtered = sourceData.filter((profile) => profile.status === status);
      setProfiles(filtered);
    }
  };

  // Custom image container component
  function RequestImageContainer({ profile, activeButton }) {
    const totalPhotos = profile?.filesId?.totalPhotos;

    const handleViewimage = (profileId) => {
      navigate(`view/images/${profileId}`);
    };

    const handleAction = async (action, profileId) => {
      try {
        const route = `profile/reqsent/${action}`;
        if (action === "withdrawal" || action === "accept" || action === "reject") {
          await updateData(route, profileId);
          refreshData();
        }
      } catch (error) {
        console.error(`Error handling ${action} request:`, error);
      }
    };

    const renderEmptyState = (actionButtons = null) => (
      <div className="image-container" style={{ position: "relative", width: "100%" }}>
        <img
          src={placeholderImage}
          className="img-fluid m-auto"
          alt="Placeholder"
          style={{
            width: "230px",
            height: "230px",
            objectFit: "cover",
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
          onClick={() => handleViewimage(profile._id)}
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
            padding: "1rem",
          }}
        >
          {actionButtons}
        </div>
      </div>
    );

    if (!profile?.filesId?.photos?.length) {
      if (activeButton === "requestSent") {
        return renderEmptyState(
          <button
            className={styles.ctaButton}
            onClick={() => handleAction("withdrawal", profile._id)}
          >
            Withdraw Request
          </button>
        );
      }
      if (activeButton === "requestReceived") {
        return renderEmptyState(null);
      }
    }

    return profile?.filesId?.photos?.map((photo) => (
      <div key={photo._id} className="image-container" style={{ position: "relative" }}>
        <img
          src={photo.url}
          className="img-fluid m-auto"
          alt="Profile"
          style={{
            width: "230px",
            height: "230px",
            objectFit: "cover",
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
          onClick={() => handleViewimage(profile._id)}
        >
          <IoImageSharp size={15} color="white" />
          <span style={{ color: "white", fontSize: "14px" }} className="p-1">
            0{totalPhotos}
          </span>
        </span>
      </div>
    ));
  }

  // Update allData when profiles are fetched
  useEffect(() => {
    if (profiles.reqSent && profiles.reqReceived) {
      setAllData(profiles);
      setProfiles(profiles.reqSent);
    }
  }, [profiles.reqSent, profiles.reqReceived]);

  if (loading) {
    return <div className="profileContainer">Loading...</div>;
  }

  return (
    <div className="profileContainer">
      <div className="profileListHeader">
        <div className="pagetitle">Request Manager</div>
        <SortFilters sortConfig={sortConfig} onSortChange={setSortDirection} />
      </div>

      <TabSwitcher activeTab={activeTab} tabs={tabs} onTabChange={switchTab} />

      <div className="row m-0 mb-1 p-0 bg-white">
        <div className="col-4 col-sm-3 col-md-2 p-2" style={{ alignContent: "center" }}>
          <StatusFilter value="all" onChange={handleStatusFilter} />
        </div>
      </div>

      <div className="row m-0 p-0">
        {getCurrentPageProfiles().length === 0 ? (
          <div className="pagetitle text-center">No Profiles Found</div>
        ) : (
          getCurrentPageProfiles().map((profile) => (
            <MyInterestCard
              key={profile._id}
              profile={profile?.userId}
              status={profile?.status}
              activeTab={activeTab}
              ProfileImagerender={RequestImageContainer}
              fetchData={refreshData}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  );
}

export default MyInterest;
