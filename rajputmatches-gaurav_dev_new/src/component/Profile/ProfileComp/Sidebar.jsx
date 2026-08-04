import React, { useState, useEffect } from "react";
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
import { fetchByRoute } from "../../../api/routeAdapter";
import { chatApi } from "../../../api";
import styles from "./Profile.module.css";
import "./Sidebar.css";

const menuItems = [
  { label: "My Details",         value: "myDetails",        icon: <User size={16} /> },
  { label: "Shortlisted",        value: "shortlisted",      icon: <Heart size={16} /> },
  { label: "Viewed Profiles",    value: "viewed",           icon: <Eye size={16} /> },
  { label: "Profile Visitors",   value: "visited",          icon: <UserCheck size={16} /> },
  { label: "Request Manager",    value: "interest",         icon: <HeartHandshake size={16} /> },
  { label: "Photo Request",      value: "request",          icon: <Camera size={16} /> },
  { label: "Document Request",   value: "documentRequest",  icon: <FileText size={16} /> },
  { label: "Contact Requests",   value: "contactRequest",   icon: <Phone size={16} /> },
  { label: "Blocked Profiles",   value: "blocked",          icon: <Ban size={16} /> },
  { label: "Messages",           value: "chat",             icon: <MessageSquare size={16} /> },
];

/* ------------------------------------------------------------------ */
/* Shared hook for fetching menu tab counts                          */
/* ------------------------------------------------------------------ */
function useSidebarCounts() {
  const [counts, setCounts] = useState({
    shortlisted: 0,
    viewed: 0,
    visited: 0,
    interest: 0,
    request: 0,
    documentRequest: 0,
    contactRequest: 0,
    blocked: 0,
    chat: 0,
  });

  // Separate state for userId so we can use it in unread calc
  const [userId, setUserId] = useState("");

  // Get userId once from localStorage/auth
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Parse JWT to get userId (middle part)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload?.id || payload?.userId || payload?._id || "");
      }
    } catch (e) {}
  }, []);

  const loadCounts = async () => {
    try {
      const [sl, viewed, visited, reqs, photoR, docR, contactR, bl, chats] = await Promise.allSettled([
        fetchByRoute("profile/show-shortlisted"),
        fetchByRoute("profile/viewed"),
        fetchByRoute("profile/visited"),
        fetchByRoute("profile/myrequests"),
        fetchByRoute("profile/photorequests"),
        fetchByRoute("profile/documentrequests"),
        fetchByRoute("profile/contactrequests"),
        fetchByRoute("profile/show-blocked"),
        chatApi.listChats(),
      ]);

      const getLen = (res, field1, field2) => {
        if (res?.status !== "fulfilled" || !res.value) return 0;
        const val = res.value;
        if (Array.isArray(val)) return val.length;
        if (field1 && Array.isArray(val[field1])) return val[field1].length;
        if (field2 && Array.isArray(val[field2])) return val[field2].length;
        return 0;
      };

      // ── Unread chat count (same logic as Navbar) ──
      let unreadChatCount = 0;
      if (chats?.status === "fulfilled" && Array.isArray(chats.value)) {
        unreadChatCount = chats.value.reduce((acc, chat) => {
          if (!chat?.lastMessage) return acc;
          const senderId = typeof chat.lastMessage.sender === "object"
            ? chat.lastMessage.sender?._id
            : chat.lastMessage.sender;
          const isFromOther = senderId && userId
            ? senderId.toString() !== userId.toString()
            : true;
          const isUnread =
            (chat.unreadCount > 0) ||
            chat.isUnread ||
            chat.lastMessage.isRead === false ||
            chat.lastMessage.seen === false ||
            (Array.isArray(chat.lastMessage.seenBy) && userId && !chat.lastMessage.seenBy.includes(userId));
          return isFromOther && isUnread ? acc + 1 : acc;
        }, 0);
      }

      setCounts({
        shortlisted: getLen(sl, "shortlisted", "profiles"),
        viewed: getLen(viewed, "visitedAt", "viewedProfiles"),
        visited: getLen(visited, "viewedBy", "visitors"),
        interest: getLen(reqs, "reqReceived"),
        request: getLen(photoR, "photoReqReceived"),
        documentRequest: getLen(docR, "documentReqReceived"),
        contactRequest: getLen(contactR, "contactReqReceived"),
        blocked: getLen(bl),
        chat: unreadChatCount,
      });
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const safeLoad = () => { if (isMounted) loadCounts(); };

    safeLoad();

    // Re-fetch count when a chat is read or new message arrives
    window.addEventListener("chatRead", safeLoad);
    window.addEventListener("newMessage", safeLoad);

    // Poll every 15 seconds for new messages
    const interval = setInterval(safeLoad, 15000);

    return () => {
      isMounted = false;
      window.removeEventListener("chatRead", safeLoad);
      window.removeEventListener("newMessage", safeLoad);
      clearInterval(interval);
    };
  }, [userId]); // re-run when userId is available

  return counts;
}


/* ------------------------------------------------------------------ */
/* Vertical sidebar — rendered inside the desktop split-pane layout   */
/* ------------------------------------------------------------------ */
export const VerticalSidebar = ({ activeContent = "myDetails", setActiveContent }) => {
  const navigate = useNavigate();
  const counts = useSidebarCounts();

  const handleItemClick = (item) => {
    if (item === "chat") {
      navigate("/message");
      return;
    }
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
              activeContent === item.value ? styles.active : ""
            }`}
            onClick={() => handleItemClick(item.value)}
          >
            <span className={styles.sidebarItemIcon}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.value !== "myDetails" && (
              <span
                style={{
                  background: activeContent === item.value ? "#ffffff" : "var(--royal-maroon, #59123B)",
                  color: activeContent === item.value ? "var(--royal-maroon, #59123B)" : "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "12px",
                  marginLeft: "auto",
                  lineHeight: "1.2",
                  boxShadow: activeContent === item.value ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {counts[item.value] !== undefined ? counts[item.value] : 0}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Horizontal pill sidebar — rendered for mobile/tablet               */
/* ------------------------------------------------------------------ */
const Sidebar = ({ activeContent = "myDetails", setActiveContent }) => {
  const navigate = useNavigate();
  const counts = useSidebarCounts();

  const handleItemClick = (item) => {
    if (item === "chat") {
      navigate("/message");
      return;
    }
    setActiveContent(item);
  };

  return (
    <aside className="sidebar-nav-container">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.value}
            className={`sidebar-menu-item ${activeContent === item.value ? "active" : ""}`}
            onClick={() => handleItemClick(item.value)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.value !== "myDetails" && (
              <span
                style={{
                  background: activeContent === item.value ? "rgba(255,255,255,0.3)" : "var(--royal-maroon, #59123B)",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "10px",
                  marginLeft: "4px",
                }}
              >
                {counts[item.value] !== undefined ? counts[item.value] : 0}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
