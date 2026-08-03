import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Logo.png"; // Replace with your logo path
import style from "../Profile/ProfileComp/Profile.module.css";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaCommentDots, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "./AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const Navbar = ({ forceSolid = false }) => {
  const { isAuthenticated, logout, userData, profile } = useAuth();
  const { siteSettings } = useSiteSettings();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleAvatar = () => setAvatarOpen((s) => !s);
  const toggleDrawer = () => setIsDrawerOpen((d) => !d);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (...paths) =>
    paths.some((path) => isActive(path)) ? "active-royal-link" : "royal-link";

  useEffect(() => {
    if (forceSolid) return;
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceSolid]);

  return (
    <header
      className={`${forceSolid ? "sticky-top" : "fixed-top"} ${isScrolled || forceSolid ? "navbar-scrolled" : "navbar-transparent"}`}
      style={{ zIndex: 1000 }}
    >
      <div className="container-fluid px-3 px-xl-5 d-flex justify-content-between align-items-center">
        <div className="logo-container flex-shrink-0">
          <Link to="/home" className="d-flex align-items-center gap-2 gap-md-3 text-decoration-none group">
            <img
              src={siteSettings.logo || Logo}
              alt={siteSettings.companyName || "Logo"}
              onError={(e) => { e.target.onerror = null; e.target.src = Logo; }}
              style={{
                height: "46px",
                width: "auto",
                maxHeight: "54px",
                objectFit: "contain",
                filter: "drop-shadow(0px 2px 6px rgba(89, 18, 59, 0.25))",
                transition: "transform 0.3s ease"
              }}
            />
            <div className="d-none d-sm-flex flex-column text-start" style={{ whiteSpace: "nowrap" }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--royal-maroon, #59123B)",
                letterSpacing: "1.2px",
                lineHeight: "1.1",
                textTransform: "uppercase"
              }}>
                {siteSettings.companyName || "Rajput Alliances"}
              </span>
              <span style={{
                fontSize: "0.6rem",
                color: "var(--royal-gold-dark, #CD9024)",
                letterSpacing: "2.5px",
                fontWeight: "600",
                textTransform: "uppercase",
                marginTop: "2px"
              }}>
                {siteSettings.tagline || "Royal Matrimonial"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="d-none d-lg-flex align-items-center">
          <ul className="d-flex align-items-center gap-1 gap-xl-2 m-0 p-0" style={{ listStyle: "none", flexWrap: "nowrap" }}>
            <li style={{ flexShrink: 0 }}>
              <Link to="/home" className={navLinkClass("/home", "/")}>
                Home
              </Link>
            </li>
            <li style={{ flexShrink: 0 }}>
              <Link to="/about" className={navLinkClass("/about", "/about-us")}>
                About
              </Link>
            </li>
            {/* <li style={{ flexShrink: 0 }}>
              <Link to="/how-to-use" className={navLinkClass("/how-to-use")}>
                How to Use
              </Link>
            </li> */}
            <li style={{ flexShrink: 0 }}>
              <Link to="/stories" className={navLinkClass("/stories")}>
                Stories
              </Link>
            </li>
            <li style={{ flexShrink: 0 }}>
              <Link to="/contact" className={navLinkClass("/contact", "/contact-us")}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="d-none d-lg-flex align-items-center gap-2 gap-xl-3" style={{ flexWrap: "nowrap", flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <Link to="/search" className="d-flex align-items-center gap-1" style={{ color: "var(--royal-maroon)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0, padding: "4px 8px" }}>
                <FaSearch size={15} /> Search
              </Link>
              <Link to="/dashboard" className="d-flex align-items-center gap-1" style={{ color: "var(--royal-maroon)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0, padding: "4px 8px" }}>
                <MdDashboard size={18} /> Dashboard
              </Link>
              <Link to="/message" className="d-flex align-items-center gap-1" style={{ color: "var(--royal-maroon)", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", whiteSpace: "nowrap", flexShrink: 0, padding: "4px 8px" }}>
                <FaCommentDots size={17} /> Messages
              </Link>
              
              <div className="position-relative" style={{ flexShrink: 0 }}>
                <div 
                  className="cursor-pointer d-flex align-items-center" 
                  onClick={toggleAvatar}
                  style={{
                    border: "1px solid rgba(237, 177, 57, 0.4)",
                    borderRadius: "30px",
                    padding: "3px 14px 3px 3px",
                    gap: "8px",
                    background: "rgba(252, 245, 234, 0.5)",
                    color: "var(--royal-maroon)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease"
                  }}
                >
                  {(() => {
                    const avatarUrl = userData?.avatar || (profile && !profile.includes("user-icon-flat-isolated") ? profile : null);
                    const initials = `${(userData?.firstName || "").charAt(0) || ""}${(userData?.lastName || "").charAt(0) || ""}`.toUpperCase();
                    return avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="rounded-circle border border-warning"
                        style={{ width: "30px", height: "30px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "30px", height: "30px", background: "var(--royal-maroon)", fontSize: "13px" }}>
                        {initials || "M"}
                      </div>
                    );
                  })()}
                  <span>{userData?.firstName || "mohit"}</span>
                </div>

                {avatarOpen && (
                  <div className="position-absolute rounded-3 p-2" style={{
                    top: "50px", right: "0", minWidth: "185px",
                    background: "rgba(252, 245, 234, 0.98)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(237, 177, 57, 0.35)",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
                  }}>
                    <Link to="/profile" className="dropdown-item py-2 px-3 rounded-2" style={{ transition: "all 0.2s ease", fontFamily: "var(--font-body)", fontWeight: "500", color: "var(--royal-text)" }} onClick={() => setAvatarOpen(false)}>My Profile</Link>
                    <Link to="/settings" className="dropdown-item py-2 px-3 rounded-2" style={{ transition: "all 0.2s ease", fontFamily: "var(--font-body)", fontWeight: "500", color: "var(--royal-text)" }} onClick={() => setAvatarOpen(false)}>Settings</Link>
                    <hr className="my-1" style={{ borderColor: "rgba(237, 177, 57, 0.2)" }} />
                    <button className="dropdown-item py-2 px-3 rounded-2 text-danger" style={{ transition: "all 0.2s ease", fontFamily: "var(--font-body)", fontWeight: "600" }} onClick={() => { setAvatarOpen(false); logout(); }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="royal-button">Login</Link>
          )}
        </div>

        {/* Mobile Navbar Elements */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          {isAuthenticated && (
            <div className="position-relative me-1">
              <FaBell size={20} color="var(--royal-maroon)" />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </div>
          )}
          <button 
            onClick={toggleDrawer}
            className="btn p-2 d-flex align-items-center justify-content-center rounded-3"
            style={{
              color: "var(--royal-maroon, #59123B)",
              background: "rgba(89, 18, 59, 0.06)",
              border: "1.5px solid var(--royal-gold, #CD9024)",
              width: "40px",
              height: "40px",
              boxShadow: "0 2px 6px rgba(89, 18, 59, 0.1)",
              transition: "all 0.2s ease"
            }}
            aria-label="Toggle Menu"
          >
            <FaBars size={22} />
          </button>
        </div>
      </div>

      {/* Drawer Overlay */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? "active" : ""}`} 
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* Slide-out Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isDrawerOpen ? "active" : ""}`}>
        <div className="drawer-header">
          <img src={Logo} alt="Logo" />
          <button
            className="drawer-close-btn d-flex align-items-center justify-content-center rounded-circle p-2"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close Menu"
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(89, 18, 59, 0.08)",
              border: "1px solid rgba(205, 144, 36, 0.4)",
              color: "var(--royal-maroon)"
            }}
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="drawer-menu">
          <Link to="/home" className={`drawer-link ${isActive("/home") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
            Home
          </Link>
          <Link to="/about" className={`drawer-link ${isActive("/about") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
            About Us
          </Link>
          {/* <Link to="/how-to-use" className={`drawer-link ${isActive("/how-to-use") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
            How to Use
          </Link> */}
          <Link to="/stories" className={`drawer-link ${isActive("/stories") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
            Stories
          </Link>
          <Link to="/contact" className={`drawer-link ${isActive("/contact") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
            Contact Us
          </Link>

          {isAuthenticated ? (
            <>
              <hr style={{ borderColor: "rgba(200, 151, 58, 0.2)", margin: "8px 0" }} />
              <Link to="/search" className={`drawer-link ${isActive("/search") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
                Search Matches
              </Link>
              <Link to="/dashboard" className={`drawer-link ${isActive("/dashboard") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
                Dashboard
              </Link>
              <Link to="/message" className={`drawer-link ${isActive("/message") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
                Messages
              </Link>
              <Link to="/profile" className={`drawer-link ${isActive("/profile") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
                My Profile
              </Link>
              <Link to="/settings" className={`drawer-link ${isActive("/settings") ? "active" : ""}`} onClick={() => setIsDrawerOpen(false)}>
                Settings
              </Link>
            </>
          ) : null}
        </div>

        <div className="drawer-footer">
          {isAuthenticated ? (
            <button 
              className="royal-button w-100" 
              style={{ padding: "10px", fontSize: "0.9rem" }}
              onClick={() => { setIsDrawerOpen(false); logout(); }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="royal-button text-center w-100 text-decoration-none" style={{ padding: "10px", fontSize: "0.9rem" }} onClick={() => setIsDrawerOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="royal-button-outline text-center w-100 text-decoration-none" style={{ padding: "9px", fontSize: "0.9rem", color: "var(--royal-maroon)", border: "1.5px solid var(--royal-maroon)", borderRadius: "8px" }} onClick={() => setIsDrawerOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
