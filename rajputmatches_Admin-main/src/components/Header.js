import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import {
  FaBars, FaExpand, FaBell, FaUser, FaChevronRight,
  FaCrown,
} from "react-icons/fa";

const Header = () => {
  const { logout, fetchUserData, updateData } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(true);

  // Track which dropdown menus are open in the sidebar
  const [openMenus, setOpenMenus] = useState({});

  const fetchNotifications = async () => {
    try {
      const data = await fetchUserData("notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-open dropdown if current path is inside it
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const newOpen = {};
    if (path.startsWith("/members")) newOpen["members"] = true;
    if (path.startsWith("/attributes")) newOpen["attributes"] = true;
    setOpenMenus(newOpen);
  }, [location.pathname]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllAsRead = async () => {
    try {
      await updateData("notifications/mark-all-read", {});
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const visibleNotifications = notifications?.slice(0, 4);

  // Helper to check if a route is active
  const isActive = (paths) => {
    const cur = location.pathname.toLowerCase();
    if (Array.isArray(paths)) {
      return paths.some((p) => cur === p.toLowerCase() || cur.startsWith(p.toLowerCase() + "/"));
    }
    return cur === paths.toLowerCase() || cur.startsWith(paths.toLowerCase() + "/");
  };

  return (
    <>
      <style>{`
        /* Sidebar Dropdown Menu Overrides to prevent Bootstrap 5 absolute positioning conflict */
        .main-sidebar .sidebar-menu li.dropdown .dropdown-menu {
          position: static !important;
          float: none !important;
          background-color: rgba(55, 8, 35, 0.4) !important;
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 4px 0 !important;
          width: auto !important;
          min-width: 0 !important;
          transform: none !important;
        }

        .main-sidebar .sidebar-menu li.dropdown .dropdown-menu li a {
          padding-left: 35px !important; /* fix caret overlap */
          color: var(--royal-gold-light) !important;
        }
      `}</style>
      <div className="navbar-bg" />

      {/* ── Top Navbar ─────────────────────────────────── */}
      <nav
        className="navbar navbar-expand-lg main-navbar sticky"
        style={{
          background: "linear-gradient(135deg, #59123B, #3f0c2a)",
          borderBottom: "3px solid #EDB139",
          boxShadow: "0 4px 20px rgba(89, 18, 59, 0.3)",
        }}
      >
        <div className="form-inline mr-auto">
          <ul className="navbar-nav mr-3">
            <li>
              <Link to="#" data-toggle="sidebar" className="nav-link nav-link-lg collapse-btn" style={{ color: "#EDB139" }}>
                <FaBars />
              </Link>
            </li>
            <li>
              <Link to="#" className="nav-link nav-link-lg fullscreen-btn" style={{ color: "#EDB139" }}>
                <FaExpand />
              </Link>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav navbar-right">
          {/* Notifications */}
          <li className="dropdown dropdown-list-toggle">
            <Link to="#" data-toggle="dropdown" className="nav-link notification-toggle nav-link-lg" style={{ color: "#EDB139" }}>
              <FaBell />
              {unreadCount > 0 && <span className="badge badge-royal-gold">{unreadCount}</span>}
            </Link>

            <div className="dropdown-menu dropdown-list dropdown-menu-right pullDown">
              <div className="dropdown-header" style={{ background: "linear-gradient(135deg, #59123B, #3f0c2a)", color: "#EDB139", borderBottom: "2px solid #EDB139" }}>
                Notifications
                <div className="float-right">
                  <Link to="#" onClick={markAllAsRead} style={{ color: "#EDB139" }}>Mark All As Read</Link>
                </div>
              </div>
              <div className="dropdown-list-content dropdown-list-icons" style={{ height: "300px", overflowY: "scroll" }}>
                {visibleNotifications?.length > 0 ? (
                  (showAll ? notifications : visibleNotifications).map((notif, index) => (
                    <Link to="#" key={index} className={`dropdown-item ${notif.isRead ? "" : "dropdown-item-unread"}`}>
                      <span className="dropdown-item-icon bg-primary text-white">
                        {notif.avatar ? <img src={notif.avatar} alt="Avatar" className="rounded-circle" style={{ width: 30, height: 30 }} /> : <FaUser />}
                      </span>
                      <span className="dropdown-item-desc">
                        <strong>{notif.userId?.email}</strong> {notif.message}
                        <span className="time">{notif.time}</span>
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-center p-2">No notifications</p>
                )}
              </div>
              <div className="dropdown-footer text-center">
                {notifications?.length > 4 && (
                  <Link to="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAll(!showAll); }}>
                    {showAll ? "Show Less" : "View All"} <FaChevronRight />
                  </Link>
                )}
              </div>
            </div>
          </li>

          {/* User Profile dropdown */}
          <li className="dropdown">
            <Link to="#" data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
              <img alt="User" src={require("../images/demoprofile.jpg")} className="user-img-radious-style" style={{ border: "2px solid #EDB139" }} />
            </Link>
            <div className="dropdown-menu dropdown-menu-right pullDown">
              <Link to="Members/Create-New-Admin" className="dropdown-item has-icon text-success">
                <i className="fas fa-user-shield text-lg" /> Add New Admin
              </Link>
              <Link to="#" onClick={logout} className="dropdown-item has-icon text-danger">
                <i className="fas fa-sign-out-alt" /> Logout
              </Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* ── Sidebar ────────────────────────────────────── */}
      <div className="main-sidebar sidebar-style-2">
        <aside id="sidebar-wrapper">
          {/* Brand */}
          <div className="sidebar-brand">
            <Link to="/dashboard">
              <FaCrown style={{ color: "#EDB139", fontSize: "1.4rem" }} />
              <span>Rajput Matches</span>
            </Link>
          </div>

          {/* Sidebar Menu Items */}
          <ul className="sidebar-menu">
            <li className="menu-header">Main</li>
            
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard" className="nav-link">
                <i className="fa fa-desktop" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className={`dropdown ${isActive(["/Members/Free-Members", "/Members/Blocked-Members", "/Members/Deleted-Members"]) ? "active" : ""}`}>
              <Link to="#" className="nav-link has-dropdown" onClick={(e) => { e.preventDefault(); toggleMenu("members"); }}>
                <i className="fa fa-users" />
                <span>Members</span>
              </Link>
              <ul className="dropdown-menu" style={{ display: openMenus["members"] ? "block" : "none" }}>
                <li className={isActive("/Members/Free-Members") ? "active" : ""}>
                  <Link className="nav-link" to="/Members/Free-Members">Free Members</Link>
                </li>
                <li className={isActive("/Members/Blocked-Members") ? "active" : ""}>
                  <Link className="nav-link" to="/Members/Blocked-Members">Blocked Members</Link>
                </li>
                <li className={isActive("/Members/Deleted-Members") ? "active" : ""}>
                  <Link className="nav-link" to="/Members/Deleted-Members">Deleted Members</Link>
                </li>
              </ul>
            </li>

            <li className="menu-header">Profile Attributes</li>
            
            <li className={`dropdown ${isActive(["/Attributes/limit"]) ? "active" : ""}`}>
              <Link to="#" className="nav-link has-dropdown" onClick={(e) => { e.preventDefault(); toggleMenu("attributes"); }}>
                <i className="fa fa-user" />
                <span>Profile Attributes</span>
              </Link>
              <ul className="dropdown-menu" style={{ display: openMenus["attributes"] ? "block" : "none" }}>
                <li className={isActive("/Attributes/limit") ? "active" : ""}>
                  <Link className="nav-link" to="/Attributes/limit">Limits</Link>
                </li>
                <li className={isActive("/Attributes/Social-Links") ? "active" : ""}>
                  <Link className="nav-link" to="/Attributes/Social-Links">Social Links</Link>
                </li>
              </ul>
            </li>

            <li className={isActive("/Success/Success-Stories") ? "active" : ""}>
              <Link to="/Success/Success-Stories" className="nav-link">
                <i className="fa fa-trophy" />
                <span>Success Stories</span>
              </Link>
            </li>

            <li className={isActive("/HappyFace") ? "active" : ""}>
              <Link to="/HappyFace" className="nav-link">
                <i className="fa fa-smile" />
                <span>Happy Faces</span>
              </Link>
            </li>

            <li className={isActive("/Contact/Contactus") ? "active" : ""}>
              <Link to="/Contact/Contactus" className="nav-link">
                <i className="fa fa-envelope" />
                <span>Contact Me</span>
              </Link>
            </li>

            <li className={isActive("/Reports") ? "active" : ""}>
              <Link to="/Reports" className="nav-link">
                <i className="fa fa-chart-line" />
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
};

export default Header;
