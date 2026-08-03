import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import ProfileInfoHeader from "./ProfileInfoHeader";
import Sidebar, { VerticalSidebar } from "./Sidebar";
import Profilenavbar from "./Profilenavbar";
import styles from "./Profile.module.css";

import Mydetails from "../BasicDetails/Mydetails";
import MyInterest from "../ProfileList/MyInterest";
import PeopleVisited from "../ProfileList/PeopleVisited";
import PhotoRequest from "../ProfileList/PhotoRequest";
import DocumentRequest from "../ProfileList/DocumentRequest";
import ViewedProfile from "../ProfileList/ViewedProfile";
import ShortlistedProfile from "../ProfileList/ShortlistedProfile";
import BlockedProfile from "../ProfileList/BlockedProfile";
import ContactRequest from "../ProfileList/ContactRequest";
import Footer from "../../Layout/Footer";
import { ProfileDetailsProvider } from "../../../context/ProfileDetailsContext";

const Profile = () => {
  const location = useLocation();

  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryTab = searchParams.get("tab") || searchParams.get("section");
    return location.state?.section || location.state?.tab || queryTab || "myDetails";
  };

  const [activeContent, setActiveContent] = useState(getInitialTab);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const targetSection = location.state?.section || location.state?.tab || searchParams.get("tab") || searchParams.get("section");
    if (targetSection) {
      setActiveContent(targetSection);
    }
  }, [location.state, location.search]);

  const renderContent = () => {
    switch (activeContent) {
      case "myDetails":
        return <Mydetails />;
      case "shortlisted":
        return <ShortlistedProfile />;
      case "viewed":
        return <ViewedProfile />;
      case "visited":
        return <PeopleVisited />;
      case "interest":
        return <MyInterest />;
      case "request":
        return <PhotoRequest />;
      case "documentRequest":
        return <DocumentRequest />;
      case "contactRequest":
        return <ContactRequest />;
      case "blocked":
        return <BlockedProfile />;
      default:
        return <Mydetails />;
    }
  };

  return (
    <div
      className="pb-bottom-nav"
      style={{
        background:
          "linear-gradient(135deg, #f8ead6 0%, #fdf6ec 60%, #f3e5d0 100%)",
        minHeight: "100vh",
      }}
    >
      <Profilenavbar />

      <div className="container py-3">
        {/* Breadcrumb */}
        <nav
          className="d-flex align-items-center gap-2 mb-3"
          style={{
            fontSize: "0.85rem",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              color: "var(--royal-maroon-dark, #59123B)",
              fontWeight: 600,
            }}
          >
            Home
          </Link>
          <ChevronRight
            size={13}
            style={{ color: "#6b7280", opacity: 0.7 }}
          />
          <span style={{ color: "var(--royal-maroon, #991c1c)", fontWeight: 500 }}>
            My Profile
          </span>
        </nav>

        {/* Profile Header & Tab Context Provider */}
        <ProfileDetailsProvider enabled={true}>
          {/* Desktop & Mobile Split Layout */}
          <div className={styles.profileLayout}>
            {/* Left: Vertical Sidebar (hidden on mobile via CSS) */}
            <div className={styles.sidebarPane}>
              <VerticalSidebar activeContent={activeContent} setActiveContent={setActiveContent} />
            </div>

            {/* Right: Content area */}
            <div className={styles.contentPane}>
              {/* Mobile/Tablet: Horizontal pill tabs */}
              <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />

              {/* Content Card */}
              <div className={styles.contentCard}>
                {renderContent()}
              </div>
            </div>
          </div>
        </ProfileDetailsProvider>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
