import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { chatApi, BASE_URL } from "../../api";
import EmojiPicker from "emoji-picker-react";

import Profilenavbar from "../Profile/ProfileComp/Profilenavbar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";

import { AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoChevronBackOutline, IoSendSharp, IoHappyOutline } from "react-icons/io5";
import { FaCheck, FaCommentDots } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { toast } from "react-toastify";

import "./Chat.css";

const SOCKET_URL = BASE_URL || "http://localhost:5000/";
const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 3,
  timeout: 5000,
});

/* ─── Helpers ─────────────────────────────────────────────── */
const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  let h = d.getHours(), m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return `${d.toLocaleDateString("en-GB", options)}  ${formatTime(dateStr)}`;
};

const getInitials = (first = "", last = "") =>
  `${(first || "").charAt(0)}${(last || "").charAt(0)}`.toUpperCase() || "U";

/* ─── Sub-Components ──────────────────────────────────────── */
const Avatar = ({ photo, first, last, size = 48, border = false }) => {
  const resolvedPhoto = photo
    ? photo.startsWith("http")
      ? photo
      : `${BASE_URL || ""}${photo.startsWith("/") ? "" : "/"}${photo}`
    : null;

  return resolvedPhoto ? (
    <img
      src={resolvedPhoto}
      alt="avatar"
      className="chat-avatar"
      style={{ width: size, height: size, ...(border ? { border: "2px solid rgba(201,168,76,0.6)" } : {}) }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  ) : (
    <div
      className={border ? "chat-header-initials" : "chat-avatar-initials"}
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {getInitials(first, last)}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════ */
const ChatApp = () => {
  const { updateData, fetchUserData, userData } = useAuth();
  const userId = userData?._id || "";

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [Status, setStatus] = useState("");
  const [RequestingId, setRequestingId] = useState("");
  const [RequestingMatrId, setRequestingMatrId] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [error, setError] = useState(null);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  /* ── Resize listener ── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Close Emoji Picker on Click Outside ── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Sync activeChatRef ── */
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages]);

  /* ── Data Loaders (useCallback to prevent infinite re-render loops) ── */
  const loadMessages = useCallback(async (chatId, showLoading = false) => {
    if (!chatId) return;
    setActiveChat(chatId);
    if (showLoading) setMessagesLoading(true);
    try {
      const msgs = await chatApi.getMessages(chatId);
      setMessages(Array.isArray(msgs) ? msgs : []);
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c._id === chatId) {
            return {
              ...c,
              unreadCount: 0,
              isUnread: false,
              lastMessage: c.lastMessage
                ? { ...c.lastMessage, seen: true, isRead: true }
                : c.lastMessage,
            };
          }
          return c;
        })
      );
      window.dispatchEvent(new Event("chatRead"));
    } catch { 
      setMessages([]); 
    } finally {
      if (showLoading) setMessagesLoading(false);
    }
  }, []);

  const loadChats = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setChatsLoading(true);
      let token = null;
      try { token = localStorage.getItem("authToken"); } catch (e) {}
      if (!token) return;
      const list = await chatApi.listChats();
      setChats(list || []);
      // Only set initial active chat if none is currently selected (using ref check)
      if (list?.length > 0 && !activeChatRef.current) {
        const first = list[0];
        if (first?._id) {
          await loadMessages(first._id, showLoading);
        }
      }
    } catch { 
      setError("Unable to load chats"); 
    } finally {
      if (showLoading) setChatsLoading(false);
    }
  }, [loadMessages]);

  const loadRequest = useCallback(async () => {
    try {
      const res = await fetchUserData("chat/status");
      if (res?.length > 0) {
        const pending = res.filter((c) => c.status === "other");
        if (pending.length > 0) {
          setRequestingId(pending[0]._id);
          setRequestingMatrId(pending[0].participants?.find((p) => p._id !== userId)?.martrId || "");
          setStatus("other");
        } else { 
          setStatus(""); 
          setRequestingId(""); 
        }
      }
    } catch (e) { 
      console.error(e); 
    }
  }, [fetchUserData, userId]);

  /* ── Socket Connection & Handlers ── */
  useEffect(() => {
    socket.connect();
    socket.on("newMessage", (msg) => {
      if (msg.chatId === activeChatRef.current) {
        if (msg._id) {
          setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
        } else {
          loadMessages(activeChatRef.current, false);
        }
      }
      loadChats(false);
    });

    return () => { 
      socket.off("newMessage"); 
      socket.disconnect(); 
    };
  }, [loadChats, loadMessages]);

  /* ── Polling (fallback) ── */
  useEffect(() => {
    if (!activeChat) return;
    const id = setInterval(() => {
      if (activeChatRef.current) {
        loadMessages(activeChatRef.current, false);
      }
    }, 8000);
    return () => clearInterval(id);
  }, [activeChat, loadMessages]);

  /* ── Initial Load ── */
  useEffect(() => {
    if (userId) { 
      loadChats(true); 
      loadRequest(); 
    }
  }, [userId, loadChats, loadRequest]);

  /* ── Actions ── */
  const sendMessage = async () => {
    if (!activeChat || !message.trim()) return;
    try {
      const sentText = message;
      setMessage("");
      setShowEmojiPicker(false);

      const res = await chatApi.sendMessage(activeChat, sentText);
      const newMsg = res?.data?.populatedMessage || res?.data;
      if (newMsg && newMsg._id) {
        setMessages((prev) => (prev.some((m) => m._id === newMsg._id) ? prev : [...prev, newMsg]));
        socket.emit("sendMessage", newMsg);
      } else {
        await loadMessages(activeChat);
      }
      loadChats();
      inputRef.current?.focus();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to send message";
      toast.error(msg, { position: "top-center", autoClose: 1500 });
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    try {
      const res = await chatApi.sendFileMessage(activeChat, file, message);
      socket.emit("sendMessage", { chatId: activeChat, message: message || "Sent an attachment" });
      setMessage("");
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        await loadMessages(activeChat);
      }
    } catch { 
      toast.error("Failed to upload file"); 
    }
    e.target.value = null;
  };

  const deleteSingle = async (deleteForAll) => {
    if (!messageToDelete?._id) return;
    try {
      await chatApi.deleteSingleMessage(messageToDelete._id, deleteForAll);
      if (activeChatRef.current) {
        await loadMessages(activeChatRef.current);
      }
      setShowDeleteModal(false);
      setMessageToDelete(null);
    } catch (err) { 
      toast.error(err.response?.data?.error || "Failed to delete message"); 
    }
  };

  const handleResponse = async (action, chatId) => {
    try {
      await updateData("chat/status/update", { action, chatId }, true);
      await loadChats();
      await loadRequest();
    } catch (e) { 
      console.error(e); 
    }
  };

  /* ── Derived State ── */
  const activeChatObj = chats.find((c) => c._id === activeChat);
  const activePartner = activeChatObj?.participants?.find((p) => p?._id?.toString() !== userId?.toString());

  const filteredChats = chats
    .filter((chat) => {
      const q = searchQuery.toLowerCase();
      return (
        chat?.participants?.some(
          (p) => p?._id?.toString() !== userId?.toString() &&
            (String(p?.martrId || "").toLowerCase().includes(q) ||
             `${p?.firstName || ""} ${p?.lastName || ""}`.toLowerCase().includes(q))
        ) || chat?.lastMessage?.message?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="chat-page-wrapper">
        <Profilenavbar />

        {/* Breadcrumb */}
        <div
          style={{
            padding: "8px 24px",
            background: "#fff",
            borderBottom: "1px solid #f0e8e0",
            fontSize: "13px",
            color: "#888",
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Link to="/home" style={{ textDecoration: "none", color: "#888" }}>Home</Link>
          <AiOutlineRight size={13} />
          <span style={{ color: "var(--chat-maroon, #6b0f1a)", fontWeight: 600 }}>Messages</span>
        </div>

        {/* Main Chat Container */}
        <div className="chat-container">

          {/* ── SIDEBAR ─────────────────────────────────────── */}
          {(!isMobile || !activeChat) && (() => {
            const unreadChatsCount = chats.reduce((acc, chat) => {
              if (!chat?.lastMessage) return acc;
              const senderId = typeof chat.lastMessage.sender === "object"
                ? chat.lastMessage.sender?._id
                : chat.lastMessage.sender;
              const isFromOther = senderId && userId ? senderId.toString() !== userId.toString() : true;
              const isUnread = (chat.unreadCount > 0) ||
                chat.isUnread ||
                chat.lastMessage.isRead === false ||
                chat.lastMessage.seen === false ||
                (Array.isArray(chat.lastMessage.seenBy) && userId && !chat.lastMessage.seenBy.includes(userId));
              return isFromOther && isUnread ? acc + 1 : acc;
            }, 0);

            return (
              <aside className="chat-sidebar">
                {/* Header */}
                <div className="chat-sidebar-header">
                  <h2 className="chat-sidebar-title">
                    <FaCommentDots style={{ marginRight: 8, opacity: 0.85 }} />
                    Messages
                  </h2>
                  {unreadChatsCount > 0 && (
                    <span className="chat-sidebar-badge">{unreadChatsCount}</span>
                  )}
                </div>

              {/* Search */}
              <div className="chat-search-box">
                <input
                  type="text"
                  className="chat-search-input"
                  placeholder="Search by name or Matri ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* List */}
              <div className="chat-list">
                {chatsLoading ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>
                    <div className="spinner-border mb-2" role="status" style={{ width: "1.8rem", height: "1.8rem", color: "#7B1A1A" }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ fontSize: 13, fontFamily: "var(--font-body)", margin: 0, fontWeight: "600", color: "#7B1A1A" }}>
                      Loading Conversations...
                    </p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#bbb" }}>
                    <FaCommentDots size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <p style={{ fontSize: 14, fontFamily: "var(--font-body)", margin: 0 }}>
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const partner = chat?.participants?.find(
                      (p) => p?._id?.toString() !== userId?.toString()
                    );
                    const name = partner ? `${partner.firstName || ""} ${partner.lastName || ""}` : "Chat User";
                    const photo = partner?.filesId?.photos?.[0]?.url;
                    const hasUnread =
                      chat?.lastMessage &&
                      chat.lastMessage.sender !== userId &&
                      !chat.lastMessage.seenBy?.includes(userId);

                    return (
                      <div
                        key={chat._id}
                        className={`chat-list-item ${chat._id === activeChat ? "active" : ""}`}
                        onClick={() => {
                          loadMessages(chat._id, true);
                        }}
                      >
                        <Avatar photo={photo} first={partner?.firstName} last={partner?.lastName} size={48} />
                        <div className="chat-list-meta">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="chat-list-name">{name}</span>
                            <span className="chat-list-time">{formatTime(chat.updatedAt)}</span>
                          </div>
                          <span className="chat-matri-id">ID: {partner?.martrId || "—"}</span>
                          <div className={`chat-list-preview ${hasUnread ? "unread" : ""}`}>
                            {chat.lastMessage?.message || "No messages yet"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>
            );
          })()}

          {/* ── MAIN CHAT ────────────────────────────────────── */}
          {(!isMobile || activeChat) && (
            <div className="chat-main">

              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  {isMobile && (
                    <button className="chat-back-btn" onClick={() => setActiveChat(null)}>
                      <IoChevronBackOutline size={20} />
                    </button>
                  )}
                  {activePartner ? (
                    <>
                      <Avatar
                        photo={activePartner?.filesId?.photos?.[0]?.url}
                        first={activePartner?.firstName}
                        last={activePartner?.lastName}
                        size={42}
                        border
                      />
                      <div>
                        <p className="chat-header-name">
                          {activePartner.firstName || ""} {activePartner.lastName || ""}
                        </p>
                        <p className="chat-header-sub">Matri ID: {activePartner?.martrId || "—"}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="chat-header-name">Select a conversation</p>
                      <p className="chat-header-sub">Choose from the list on the left</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Request Banner */}
              {Status === "other" && (
                <div className="chat-request-bar">
                  <p className="chat-request-text">
                    💬 <strong>Matri ID: {RequestingMatrId}</strong> wants to chat with you.
                    Would you like to start a conversation?
                  </p>
                  <div className="chat-request-actions">
                    <button className="chat-req-accept" onClick={() => handleResponse("accepted", RequestingId)}>
                      <FaCheck size={12} /> Accept
                    </button>
                    <button className="chat-req-reject" onClick={() => handleResponse("rejected", RequestingId)}>
                      <GiCancel size={12} /> Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="chat-messages-area" ref={chatContainerRef}>
                {messagesLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 20px" }}>
                    <div className="spinner-border mb-3" role="status" style={{ width: "2.5rem", height: "2.5rem", color: "#EDB139" }}>
                      <span className="visually-hidden">Loading messages...</span>
                    </div>
                    <p style={{ fontSize: 14, fontFamily: "var(--font-body)", margin: 0, fontWeight: "600", color: "#7B1A1A" }}>
                      Loading Messages...
                    </p>
                  </div>
                ) : !activeChat ? (
                  <div className="chat-empty-state">
                    <div className="chat-empty-icon">
                      <FaCommentDots size={36} color="var(--chat-maroon, #6b0f1a)" />
                    </div>
                    <p className="chat-empty-title">Start a Conversation</p>
                    <p className="chat-empty-sub">
                      Select a chat from the sidebar to view messages and connect with your matches.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty-state">
                    <div className="chat-empty-icon">
                      <FaCommentDots size={36} color="var(--chat-maroon, #6b0f1a)" />
                    </div>
                    <p className="chat-empty-title">No Messages Yet</p>
                    <p className="chat-empty-sub">
                      Send the first message to start your royal conversation! 💬
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMine = (msg.sender?._id || msg.sender)?.toString() === userId?.toString();
                    const imgSrc = msg.attachmentUrl
                      ? msg.attachmentUrl.startsWith("http")
                        ? msg.attachmentUrl
                        : `${BASE_URL || ""}${msg.attachmentUrl.startsWith("/") ? "" : "/"}${msg.attachmentUrl}`
                      : null;

                    return (
                      <div key={msg._id || index} className={`chat-msg-row ${isMine ? "mine" : "theirs"}`}>
                        <div className={`chat-bubble ${isMine ? "mine" : "theirs"} ${msg.isDeletedForAll ? "deleted" : ""}`}>
                          {/* Delete icon */}
                          {!msg.isDeletedForAll && (
                            <span
                              className="chat-delete-icon"
                              onClick={() => { setMessageToDelete(msg); setShowDeleteModal(true); }}
                              title="Delete"
                            >
                              <RiDeleteBin5Line size={14} />
                            </span>
                          )}

                          {msg.isDeletedForAll ? (
                            <span>🚫 This message was deleted</span>
                          ) : (
                            <>
                              {imgSrc && (
                                <img
                                  src={imgSrc}
                                  alt="attachment"
                                  className="chat-attachment-img"
                                  onClick={() => window.open(imgSrc, "_blank")}
                                  onError={(e) => (e.target.style.display = "none")}
                                />
                              )}
                              {msg.message && <span>{msg.message}</span>}
                            </>
                          )}
                        </div>
                        <span className="chat-bubble-time">{formatDate(msg.createdAt)}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Bar */}
              {activeChat && (
                <div className="chat-input-bar position-relative">

                  {/* Emoji Button */}
                  <button
                    className="chat-input-icon-btn"
                    onClick={() => setShowEmojiPicker((p) => !p)}
                    title="Emoji"
                    type="button"
                  >
                    <IoHappyOutline size={26} />
                  </button>

                  {/* Emoji Picker Popup */}
                  {showEmojiPicker && (
                    <div className="chat-emoji-popup" ref={emojiPickerRef}>
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setMessage((prev) => prev + emojiData.emoji);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }}
                      />
                    </div>
                  )}

                  {/* Text Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    className="chat-input-field"
                    placeholder="Type a message…"
                    value={message}
                    maxLength={300}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  />

                  {/* Send Button */}
                  <button
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    title="Send"
                    type="button"
                  >
                    <IoSendSharp size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* ── Delete Modal ─────────────────────────────────────── */}
      {showDeleteModal && (
        <div
          className="chat-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) { setShowDeleteModal(false); setMessageToDelete(null); }
          }}
        >
          <div className="chat-modal">
            <div className="chat-modal-header">
              <p className="chat-modal-header-title">🗑️ Delete Message</p>
              <button
                className="chat-modal-close"
                onClick={() => { setShowDeleteModal(false); setMessageToDelete(null); }}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="chat-modal-body">
              This action cannot be undone. How would you like to delete this message?
            </div>
            <div className="chat-modal-footer">
              {(messageToDelete?.sender?._id || messageToDelete?.sender)?.toString() === userId?.toString() && (
                <button className="chat-modal-btn-danger" onClick={() => deleteSingle(true)}>
                  🗑️ Delete for Everyone
                </button>
              )}
              <button className="chat-modal-btn-secondary" onClick={() => deleteSingle(false)}>
                🙈 Delete for Me Only
              </button>
              <button
                className="chat-modal-btn-ghost"
                onClick={() => { setShowDeleteModal(false); setMessageToDelete(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatApp;
