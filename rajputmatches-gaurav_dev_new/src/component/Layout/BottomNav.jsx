import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaCommentDots, FaUser } from "react-icons/fa";
import { useAuth } from "./AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide bottom nav on login and signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const allNavItems = [
    { name: "Home",     path: "/home",    icon: <FaHome size={20} /> },
    { name: "Search",   path: "/search",  icon: <FaSearch size={20} /> },
    { name: "Messages", path: "/message", icon: <FaCommentDots size={20} /> },
    { name: "Profile",  path: "/profile", icon: <FaUser size={20} /> },
  ];

  // Messages sirf login ke baad dikhe
  const navItems = allNavItems.filter(
    (item) => item.name !== "Messages" || isAuthenticated
  );

  const isActive = (path) => {
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className="bottom-nav d-lg-none"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "62px",
        backgroundColor: "#ffffff",
        borderTop: "2px solid var(--royal-gold, #d4af37)",
        boxShadow: "0 -4px 20px rgba(63, 12, 42, 0.15)",
        zIndex: 9999,
        paddingBottom: "env(safe-area-inset-bottom)",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div className="d-flex justify-content-around align-items-center w-100 h-100 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className="d-flex flex-column align-items-center justify-content-center text-decoration-none py-1"
              style={{
                flex: 1,
                color: active ? "var(--royal-maroon, #8b0000)" : "#6c757d",
                transition: "all 0.2s ease-in-out"
              }}
            >
              <div
                style={{
                  transform: active ? "scale(1.15)" : "scale(1)",
                  color: active ? "var(--royal-maroon, #8b0000)" : "inherit",
                  transition: "transform 0.2s ease"
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: active ? "700" : "500",
                  marginTop: "2px",
                  color: active ? "var(--royal-maroon, #8b0000)" : "inherit",
                }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
