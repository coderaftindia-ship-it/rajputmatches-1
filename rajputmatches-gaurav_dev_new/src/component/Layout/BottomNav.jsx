import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaCommentDots, FaUser } from "react-icons/fa";
import { useAuth } from "./AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const allNavItems = [
    { name: "Home",     path: "/home",    icon: <FaHome size={24} /> },
    { name: "Search",   path: "/search",  icon: <FaSearch size={22} /> },
    { name: "Messages", path: "/message", icon: <FaCommentDots size={24} /> },
    { name: "Profile",  path: "/profile", icon: <FaUser size={22} /> },
  ];

  // Messages sirf login ke baad dikhe
  const navItems = allNavItems.filter(
    (item) => item.name !== "Messages" || isAuthenticated
  );

  const isActive = (path) => {
    if (path === "/home" && location.pathname === "/") return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className="bottom-nav d-lg-none fixed-bottom bg-white shadow-lg"
      style={{
        height: "64px",
        borderTop: "1px solid rgba(212, 175, 55, 0.35)",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        zIndex: 1050,
        paddingBottom: "env(safe-area-inset-bottom)",
        overflow: "hidden",
        width: "100%",
        left: 0,
        right: 0,
      }}
    >
      <div className="d-flex justify-content-around align-items-center h-100">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`d-flex flex-column align-items-center text-decoration-none ${
              isActive(item.path) ? "active-nav-item" : "text-secondary"
            }`}
            style={{ minWidth: "60px" }}
          >
            <div
              className={`mb-1 transition-all ${
                isActive(item.path) ? "text-royal-maroon" : ""
              }`}
              style={{
                color: isActive(item.path) ? "var(--royal-maroon)" : "inherit",
                transform: isActive(item.path) ? "scale(1.1)" : "scale(1)",
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: isActive(item.path) ? "600" : "400",
                color: isActive(item.path) ? "var(--royal-maroon)" : "inherit",
              }}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
