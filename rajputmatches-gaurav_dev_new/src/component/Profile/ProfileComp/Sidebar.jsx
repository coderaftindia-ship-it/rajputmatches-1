import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  Eye,
  UserCheck,
  HeartHandshake,
  Camera,
  Ban,
  MessageSquare,
  Phone,
  FileText,
} from "lucide-react";
import styles from "./Profile.module.css";
import "./Sidebar.css";

const menuItems = [
  { label: "My Details",         value: "myDetails",        icon: <User size={16} /> },
  { label: "Shortlisted",        value: "shortlisted",      icon: <Heart size={16} /> },
  { label: "Request Manager",   value: "interest",         icon: <HeartHandshake size={16} /> },
  { label: "Photo Request",      value: "request",          icon: <Camera size={16} /> },
  { label: "Document Request",   value: "documentRequest",  icon: <FileText size={16} /> },
  { label: "Contact Requests",   value: "contactRequest",   icon: <Phone size={16} /> },
  { label: "Blocked Profiles",   value: "blocked",          icon: <Ban size={16} /> },
  { label: "Chat",               value: "chat",             icon: <MessageSquare size={16} /> },
];

/* ------------------------------------------------------------------ */
/* Vertical sidebar — rendered inside the desktop split-pane layout   */
/* ------------------------------------------------------------------ */
export const VerticalSidebar = ({ setActiveContent }) => {
  const [activeItem, setActiveItem] = useState("myDetails");
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item === "chat") {
      navigate("/message");
      return;
    }
    setActiveItem(item);
    setActiveContent(item);
  };

  return (
    <div className={styles.verticalSidebar}>
      <div className={styles.sidebarHeader}>Navigation</div>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.value}
            className={`${styles.verticalNavItem} ${
              activeItem === item.value ? styles.active : ""
            }`}
            onClick={() => handleItemClick(item.value)}
          >
            <span className={styles.sidebarItemIcon}>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Horizontal pill sidebar — rendered for mobile/tablet               */
/* ------------------------------------------------------------------ */
const Sidebar = ({ setActiveContent }) => {
  const [activeItem, setActiveItem] = useState("myDetails");
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item === "chat") {
      navigate("/message");
      return;
    }
    setActiveItem(item);
    setActiveContent(item);
  };

  return (
    <aside className="sidebar-nav-container">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.value}
            className={`sidebar-menu-item ${activeItem === item.value ? "active" : ""}`}
            onClick={() => handleItemClick(item.value)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
