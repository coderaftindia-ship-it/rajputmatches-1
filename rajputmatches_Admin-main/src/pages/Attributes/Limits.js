import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";

const Limits = () => {
  const { fetchUserData } = useAuth();
  const baseUrl = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");

  // Active tab state: 'role' or 'individual'
  const [activeTab, setActiveTab] = useState("role");

  // Loading states
  const [roleLoading, setRoleLoading] = useState(false);
  const [individualLoading, setIndividualLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Role limits state ---
  const [freeLimit, setFreeLimit] = useState({
    count: 2,
    periodType: "lifetime",
    startDate: "",
    endDate: "",
  });
  const [premiumLimit, setPremiumLimit] = useState({
    count: 50,
    periodType: "lifetime",
    startDate: "",
    endDate: "",
  });
  const [freeMessageLimit, setFreeMessageLimit] = useState(5);

  // --- Individual limits state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Override limit form state
  const [overrideForm, setOverrideForm] = useState({
    count: 5,
    periodType: "daily",
    startDate: "",
    endDate: "",
  });

  // Table of active overrides
  const [activeOverrides, setActiveOverrides] = useState([]);

  // --- Request send limits state ---
  const [freeRequestLimitVal, setFreeRequestLimitVal] = useState(5);
  const [premiumRequestLimitVal, setPremiumRequestLimitVal] = useState(100);

  // --- Individual request limits state ---
  const [requestSearchQuery, setRequestSearchQuery] = useState("");
  const [requestSearchResults, setRequestSearchResults] = useState([]);
  const [selectedRequestUser, setSelectedRequestUser] = useState(null);
  const [showRequestDropdown, setShowRequestDropdown] = useState(false);
  const requestDropdownRef = useRef(null);

  const [requestOverrideForm, setRequestOverrideForm] = useState({
    count: 5,
    periodType: "lifetime",
    startDate: "",
    endDate: "",
  });

  const [activeRequestOverrides, setActiveRequestOverrides] = useState([]);
  const [requestIndividualLoading, setRequestIndividualLoading] = useState(false);
  const [requestSearchLoading, setRequestSearchLoading] = useState(false);

  // Fetch all limit data
  const fetchAllData = async () => {
    try {
      // 1. Fetch role-based limits
      const limitsData = await fetchUserData("limits");
      if (limitsData) {
        setFreeMessageLimit(limitsData.freeMessageLimit || 5);
        setFreeRequestLimitVal(limitsData.freeRequestSendLimit !== undefined ? limitsData.freeRequestSendLimit : 5);
        setPremiumRequestLimitVal(limitsData.premiumRequestSendLimit !== undefined ? limitsData.premiumRequestSendLimit : 100);
        if (limitsData.freeLimit) {
          setFreeLimit({
            count: limitsData.freeLimit.count || 2,
            periodType: limitsData.freeLimit.periodType || "lifetime",
            startDate: limitsData.freeLimit.startDate
              ? limitsData.freeLimit.startDate.substring(0, 10)
              : "",
            endDate: limitsData.freeLimit.endDate
              ? limitsData.freeLimit.endDate.substring(0, 10)
              : "",
          });
        }
        if (limitsData.premiumLimit) {
          setPremiumLimit({
            count: limitsData.premiumLimit.count || 50,
            periodType: limitsData.premiumLimit.periodType || "lifetime",
            startDate: limitsData.premiumLimit.startDate
              ? limitsData.premiumLimit.startDate.substring(0, 10)
              : "",
            endDate: limitsData.premiumLimit.endDate
              ? limitsData.premiumLimit.endDate.substring(0, 10)
              : "",
          });
        }
      }

      // 2. Fetch individual user overrides
      const token = localStorage.getItem("adminAuthToken");
      const overridesResponse = await axios.get(`${baseUrl}/limits/individual`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (overridesResponse.data) {
        setActiveOverrides(overridesResponse.data.userLimits || overridesResponse.data || []);
      }

      // 3. Fetch individual request overrides
      const reqOverridesResponse = await axios.get(`${baseUrl}/limits/request-send/individual`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reqOverridesResponse.data) {
        setActiveRequestOverrides(reqOverridesResponse.data.userLimits || reqOverridesResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching limits:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle dropdown click-outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user search autocomplete
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await axios.get(
          `${baseUrl}/limits/users/search?query=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(res.data.users || res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle saving role limits
  const handleSaveRoleLimits = async (e, type) => {
    e.preventDefault();
    setRoleLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const payload = {
        freeMessageLimit,
      };

      if (type === "free") {
        if (freeLimit.periodType === "custom" && (!freeLimit.startDate || !freeLimit.endDate)) {
          toast.error("Please provide start and end dates for custom period");
          setRoleLoading(false);
          return;
        }
        payload.freeLimit = freeLimit;
      } else if (type === "premium") {
        if (premiumLimit.periodType === "custom" && (!premiumLimit.startDate || !premiumLimit.endDate)) {
          toast.error("Please provide start and end dates for custom period");
          setRoleLoading(false);
          return;
        }
        payload.premiumLimit = premiumLimit;
      }

      const response = await axios.put(
        `${baseUrl}/limits/update`,
        { data: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast.success(`${type.toUpperCase()} Limit updated successfully!`);
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role limits");
      console.error(error);
    } finally {
      setRoleLoading(false);
    }
  };

  // Handle selecting a user from autocomplete
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);

    // Check if this user already has an override
    const existing = activeOverrides.find((o) => o.userId?._id === user._id);
    if (existing) {
      setOverrideForm({
        count: existing.count,
        periodType: existing.periodType,
        startDate: existing.startDate ? existing.startDate.substring(0, 10) : "",
        endDate: existing.endDate ? existing.endDate.substring(0, 10) : "",
      });
    } else {
      setOverrideForm({
        count: 5,
        periodType: "daily",
        startDate: "",
        endDate: "",
      });
    }
  };

  // Handle saving individual override
  const handleSaveOverride = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIndividualLoading(true);

    try {
      const token = localStorage.getItem("adminAuthToken");
      if (overrideForm.periodType === "custom" && (!overrideForm.startDate || !overrideForm.endDate)) {
        toast.error("Please provide start and end dates for custom period");
        setIndividualLoading(false);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/limits/individual`,
        {
          userId: selectedUser._id,
          count: overrideForm.count,
          periodType: overrideForm.periodType,
          startDate: overrideForm.startDate,
          endDate: overrideForm.endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast.success(`Override limit saved for ${selectedUser.firstName}!`);
        setSelectedUser(null);
        setOverrideForm({ count: 5, periodType: "daily", startDate: "", endDate: "" });
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save individual override");
      console.error(error);
    } finally {
      setIndividualLoading(false);
    }
  };

  // Handle request user search autocomplete
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (requestSearchQuery.trim().length < 2) {
        setRequestSearchResults([]);
        return;
      }
      setRequestSearchLoading(true);
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await axios.get(
          `${baseUrl}/limits/users/search?query=${encodeURIComponent(requestSearchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequestSearchResults(res.data.users || res.data || []);
        setShowRequestDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setRequestSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [requestSearchQuery]);

  // Handle request dropdown click-outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (requestDropdownRef.current && !requestDropdownRef.current.contains(event.target)) {
        setShowRequestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle saving role request limits
  const handleSaveRequestRoleLimits = async (e, type) => {
    e.preventDefault();
    setRoleLoading(true);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const payload = {};

      if (type === "free") {
        payload.freeRequestSendLimit = freeRequestLimitVal;
      } else if (type === "premium") {
        payload.premiumRequestSendLimit = premiumRequestLimitVal;
      }

      const response = await axios.put(
        `${baseUrl}/limits/update`,
        { data: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast.success(`Role-based Request Limit for ${type.toUpperCase()} updated successfully!`);
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role request limits");
      console.error(error);
    } finally {
      setRoleLoading(false);
    }
  };

  const handleSelectRequestUser = (user) => {
    setSelectedRequestUser(user);
    setRequestSearchQuery("");
    setRequestSearchResults([]);
    setShowRequestDropdown(false);

    // Check if this user already has an override
    const existing = activeRequestOverrides.find((o) => o.userId?._id === user._id);
    if (existing) {
      setRequestOverrideForm({
        count: existing.count,
        periodType: existing.periodType,
        startDate: existing.startDate ? existing.startDate.substring(0, 10) : "",
        endDate: existing.endDate ? existing.endDate.substring(0, 10) : "",
      });
    } else {
      setRequestOverrideForm({
        count: 5,
        periodType: "lifetime",
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleSaveRequestOverride = async (e) => {
    e.preventDefault();
    if (!selectedRequestUser) return;
    setRequestIndividualLoading(true);

    try {
      const token = localStorage.getItem("adminAuthToken");
      if (requestOverrideForm.periodType === "custom" && (!requestOverrideForm.startDate || !requestOverrideForm.endDate)) {
        toast.error("Please provide start and end dates for custom period");
        setRequestIndividualLoading(false);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/limits/request-send/individual`,
        {
          userId: selectedRequestUser._id,
          count: requestOverrideForm.count,
          periodType: requestOverrideForm.periodType,
          startDate: requestOverrideForm.startDate,
          endDate: requestOverrideForm.endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast.success(`Request override limit saved for ${selectedRequestUser.firstName}!`);
        setSelectedRequestUser(null);
        setRequestOverrideForm({ count: 5, periodType: "lifetime", startDate: "", endDate: "" });
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save individual request override");
      console.error(error);
    } finally {
      setRequestIndividualLoading(false);
    }
  };

  // Handle deleting individual override
  const handleDeleteOverride = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this custom limit? The user will revert to their role-based limit.")) {
      return;
    }
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.delete(`${baseUrl}/limits/individual/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        toast.success("Individual limit removed successfully.");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to remove override limit.");
      console.error(error);
    }
  };

  const handleDeleteRequestOverride = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this custom request limit? The user will revert to their role-based request limit.")) {
      return;
    }
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.delete(`${baseUrl}/limits/request-send/individual/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        toast.success("Individual request limit removed successfully.");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to remove request override limit.");
      console.error(error);
    }
  };

  return (
    <div className="main-content">
      {/* Scope CSS inside Limits component to ensure stunning visual style */}
      <style>{`
        .limits-container {
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #2D3748;
        }
        .header-title {
          background: linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 2rem;
          margin-bottom: 5px;
        }
        .header-subtitle {
          color: #718096;
          font-size: 0.95rem;
          margin-bottom: 25px;
        }
        .glass-tab-nav {
          display: flex;
          background: rgba(240, 244, 248, 0.8);
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 25px;
          width: fit-content;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .glass-tab-btn {
          border: none;
          outline: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          color: #4A5568;
        }
        .glass-tab-btn.active {
          background: #FFFFFF;
          color: #667EEA;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .glass-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
        }
        .card-accent-free {
          border-top: 5px solid #3182CE;
        }
        .card-accent-premium {
          border-top: 5px solid #D69E2E;
        }
        .card-accent-individual {
          border-top: 5px solid #805AD5;
        }
        .form-label-custom {
          font-weight: 600;
          font-size: 0.88rem;
          color: #4A5568;
          margin-bottom: 6px;
        }
        .input-premium {
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          padding: 11px 15px;
          font-size: 0.92rem;
          transition: all 0.2s ease;
          color: #2D3748;
        }
        .input-premium:focus {
          border-color: #667EEA;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
          outline: none;
        }
        .btn-premium-save {
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 10px;
          padding: 11px 22px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .btn-premium-save:hover {
          opacity: 0.95;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }
        .btn-premium-save:active {
          transform: translateY(0);
        }
        .search-container {
          position: relative;
        }
        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 280px;
          overflow-y: auto;
          margin-top: 6px;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.2s ease;
          border-bottom: 1px solid #F7FAFC;
        }
        .search-result-item:last-child {
          border-bottom: none;
        }
        .search-result-item:hover {
          background: #EDF2F7;
        }
        .user-avatar-placeholder {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          margin-right: 12px;
        }
        .user-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 12px;
          border: 1.5px solid #E2E8F0;
        }
        .badge-premium-tag {
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          margin-left: 8px;
        }
        .badge-tag-free {
          background: #EBF8FF;
          color: #2B6CB0;
        }
        .badge-tag-subscribed {
          background: #FEFCBF;
          color: #975A16;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .table-custom th {
          background: #F7FAFC;
          color: #4A5568;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #E2E8F0;
          padding: 14px 18px;
        }
        .table-custom td {
          padding: 14px 18px;
          vertical-align: middle;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.9rem;
        }
        .btn-action-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-action-edit {
          background: #EBF8FF;
          color: #3182CE;
          margin-right: 8px;
        }
        .btn-action-edit:hover {
          background: #3182CE;
          color: white;
        }
        .btn-action-delete {
          background: #FED7D7;
          color: #E53E3E;
        }
        .btn-action-delete:hover {
          background: #E53E3E;
          color: white;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #A0AEC0;
        }
        .selected-user-banner {
          background: #F7FAFC;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px dashed #CBD5E0;
          margin-bottom: 20px;
        }
      `}</style>

      <section className="section limits-container">
        <div className="section-body">
          <div className="row">
            <div className="col-12">
              <h2 className="header-title">Profile View Limits Manager</h2>
              <p className="header-subtitle">
                Configure profile view quotas dynamically based on roles or define individual overrides for specific users.
              </p>

              {/* Navigation Tabs */}
              <div className="glass-tab-nav">
                <button
                  className={`glass-tab-btn ${activeTab === "role" ? "active" : ""}`}
                  onClick={() => setActiveTab("role")}
                >
                  Role-Based Limits (Views)
                </button>
                <button
                  className={`glass-tab-btn ${activeTab === "individual" ? "active" : ""}`}
                  onClick={() => setActiveTab("individual")}
                >
                  Individual User Limits (Views)
                </button>
                <button
                  className={`glass-tab-btn ${activeTab === "request-send" ? "active" : ""}`}
                  onClick={() => setActiveTab("request-send")}
                >
                  Request Send Limits
                </button>
              </div>

              {/* TAB 1: ROLE-BASED LIMITS */}
              {activeTab === "role" && (
                <div className="row animate-fade-in">
                  {/* Free Role Card */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card glass-card card-accent-free h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Free Member Limits
                        </h4>
                        <span className="badge badge-primary badge-shadow">Free Role</span>
                      </div>
                      <form onSubmit={(e) => handleSaveRoleLimits(e, "free")}>
                        <div className="card-body">
                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Profile Views Limit Count</label>
                            <input
                              type="number"
                              className="form-control input-premium"
                              value={freeLimit.count}
                              onChange={(e) =>
                                setFreeLimit({ ...freeLimit, count: Number(e.target.value) })
                              }
                              min="0"
                              max="9999"
                              required
                            />
                            <small className="form-text text-muted">
                              Number of unique profiles a free member can view.
                            </small>
                          </div>

                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Limit Period Duration</label>
                            <select
                              className="form-control input-premium"
                              value={freeLimit.periodType}
                              onChange={(e) =>
                                setFreeLimit({ ...freeLimit, periodType: e.target.value })
                              }
                            >
                              <option value="daily">Daily Reset</option>
                              <option value="weekly">Weekly Reset</option>
                              <option value="monthly">Monthly Reset</option>
                              <option value="yearly">Yearly Reset</option>
                              <option value="custom">Custom Date Range</option>
                              <option value="lifetime">Lifetime (No Reset)</option>
                            </select>
                          </div>

                          {freeLimit.periodType === "custom" && (
                            <div className="row animate-fade-in mb-3">
                              <div className="col-6 form-group d-flex flex-column">
                                <label className="form-label-custom">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control input-premium"
                                  value={freeLimit.startDate}
                                  onChange={(e) =>
                                    setFreeLimit({ ...freeLimit, startDate: e.target.value })
                                  }
                                  required
                                />
                              </div>
                              <div className="col-6 form-group d-flex flex-column">
                                <label className="form-label-custom">End Date</label>
                                <input
                                  type="date"
                                  className="form-control input-premium"
                                  value={freeLimit.endDate}
                                  onChange={(e) =>
                                    setFreeLimit({ ...freeLimit, endDate: e.target.value })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          )}

                          <div className="form-group mb-2 d-flex flex-column">
                            <label className="form-label-custom">Free Message limit (0-999)</label>
                            <input
                              type="number"
                              className="form-control input-premium"
                              value={freeMessageLimit}
                              onChange={(e) => setFreeMessageLimit(Number(e.target.value))}
                              min="0"
                              max="999"
                              required
                            />
                            <small className="form-text text-muted">
                              Number of connection request messages free members can send.
                            </small>
                          </div>
                        </div>
                        <div className="card-footer text-right bg-transparent border-0 pt-0">
                          <button
                            type="submit"
                            className="btn-premium-save"
                            disabled={roleLoading}
                          >
                            {roleLoading ? "Updating..." : "Update Free Limits"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Premium Role Card */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card glass-card card-accent-premium h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Premium Member Limits
                        </h4>
                        <span className="badge badge-warning badge-shadow">Premium Role</span>
                      </div>
                      <form onSubmit={(e) => handleSaveRoleLimits(e, "premium")}>
                        <div className="card-body">
                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Profile Views Limit Count</label>
                            <input
                              type="number"
                              className="form-control input-premium"
                              value={premiumLimit.count}
                              onChange={(e) =>
                                setPremiumLimit({ ...premiumLimit, count: Number(e.target.value) })
                              }
                              min="0"
                              max="99999"
                              required
                            />
                            <small className="form-text text-muted">
                              Number of unique profiles a premium subscriber can view.
                            </small>
                          </div>

                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Limit Period Duration</label>
                            <select
                              className="form-control input-premium"
                              value={premiumLimit.periodType}
                              onChange={(e) =>
                                setPremiumLimit({ ...premiumLimit, periodType: e.target.value })
                              }
                            >
                              <option value="daily">Daily Reset</option>
                              <option value="weekly">Weekly Reset</option>
                              <option value="monthly">Monthly Reset</option>
                              <option value="yearly">Yearly Reset</option>
                              <option value="custom">Custom Date Range</option>
                              <option value="lifetime">Lifetime (No Reset)</option>
                            </select>
                          </div>

                          {premiumLimit.periodType === "custom" && (
                            <div className="row animate-fade-in mb-3">
                              <div className="col-6 form-group d-flex flex-column">
                                <label className="form-label-custom">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control input-premium"
                                  value={premiumLimit.startDate}
                                  onChange={(e) =>
                                    setPremiumLimit({ ...premiumLimit, startDate: e.target.value })
                                  }
                                  required
                                />
                              </div>
                              <div className="col-6 form-group d-flex flex-column">
                                <label className="form-label-custom">End Date</label>
                                <input
                                  type="date"
                                  className="form-control input-premium"
                                  value={premiumLimit.endDate}
                                  onChange={(e) =>
                                    setPremiumLimit({ ...premiumLimit, endDate: e.target.value })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="card-footer text-right bg-transparent border-0 pt-0" style={{ marginTop: "75px" }}>
                          <button
                            type="submit"
                            className="btn-premium-save"
                            disabled={roleLoading}
                          >
                            {roleLoading ? "Updating..." : "Update Premium Limits"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INDIVIDUAL USER OVERRIDES */}
              {activeTab === "individual" && (
                <div className="row animate-fade-in">
                  {/* Search and Setup Card */}
                  <div className="col-12 col-lg-5 mb-4">
                    <div className="card glass-card card-accent-individual h-100">
                      <div className="card-header">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Add User Override Limit
                        </h4>
                      </div>
                      <div className="card-body">
                        {/* Search field */}
                        <div className="form-group search-container mb-4 d-flex flex-column">
                          <label className="form-label-custom">Search Member</label>
                          <input
                            type="text"
                            className="form-control input-premium"
                            placeholder="Search by Name, Email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchLoading && (
                            <small className="form-text text-muted mt-1">Searching...</small>
                          )}

                          {showDropdown && searchResults.length > 0 && (
                            <div className="search-results-dropdown" ref={dropdownRef}>
                              {searchResults.map((user) => (
                                <div
                                  key={user._id}
                                  className="search-result-item"
                                  onClick={() => handleSelectUser(user)}
                                >
                                  {user.avatar ? (
                                    <img
                                      className="user-avatar-img"
                                      src={user.avatar}
                                      alt={user.firstName}
                                    />
                                  ) : (
                                    <div className="user-avatar-placeholder">
                                      {user.firstName[0]}
                                    </div>
                                  )}
                                  <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {user.firstName} {user.lastName}
                                      <span
                                        className={`badge-premium-tag ${
                                          user.isSubscribed
                                            ? "badge-tag-subscribed"
                                            : "badge-tag-free"
                                        }`}
                                      >
                                        {user.isSubscribed ? "Premium" : "Free"}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: "0.78rem", color: "#718096" }}>
                                      ID: {user.martrId} | {user.email}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected User display */}
                        {selectedUser && (
                          <div className="selected-user-banner animate-fade-in">
                            <div className="d-flex align-items-center">
                              {selectedUser.avatar ? (
                                <img
                                  className="user-avatar-img"
                                  src={selectedUser.avatar}
                                  alt={selectedUser.firstName}
                                />
                              ) : (
                                <div className="user-avatar-placeholder">
                                  {selectedUser.firstName[0]}
                                </div>
                              )}
                              <div>
                                <h6 className="m-0" style={{ fontWeight: 700 }}>
                                  {selectedUser.firstName} {selectedUser.lastName}
                                </h6>
                                <span style={{ fontSize: "0.75rem", color: "#718096" }}>
                                  ID: {selectedUser.martrId}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: "8px" }}
                              onClick={() => setSelectedUser(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Limit Override Setup Form */}
                        {selectedUser && (
                          <form onSubmit={handleSaveOverride} className="animate-fade-in">
                            <div className="form-group mb-3 d-flex flex-column">
                              <label className="form-label-custom">Override Views Limit</label>
                              <input
                                type="number"
                                className="form-control input-premium"
                                value={overrideForm.count}
                                onChange={(e) =>
                                  setOverrideForm({
                                    ...overrideForm,
                                    count: Number(e.target.value),
                                  })
                                }
                                min="0"
                                required
                              />
                            </div>

                            <div className="form-group mb-3 d-flex flex-column">
                              <label className="form-label-custom">Period Type</label>
                              <select
                                className="form-control input-premium"
                                value={overrideForm.periodType}
                                onChange={(e) =>
                                  setOverrideForm({
                                    ...overrideForm,
                                    periodType: e.target.value,
                                  })
                                }
                              >
                                <option value="daily">Daily Reset</option>
                                <option value="weekly">Weekly Reset</option>
                                <option value="monthly">Monthly Reset</option>
                                <option value="yearly">Yearly Reset</option>
                                <option value="custom">Custom Date Range</option>
                                <option value="lifetime">Lifetime (No Reset)</option>
                              </select>
                            </div>

                            {overrideForm.periodType === "custom" && (
                              <div className="row animate-fade-in mb-3">
                                <div className="col-6 form-group d-flex flex-column">
                                  <label className="form-label-custom">Start Date</label>
                                  <input
                                    type="date"
                                    className="form-control input-premium"
                                    value={overrideForm.startDate}
                                    onChange={(e) =>
                                      setOverrideForm({
                                        ...overrideForm,
                                        startDate: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="col-6 form-group d-flex flex-column">
                                  <label className="form-label-custom">End Date</label>
                                  <input
                                    type="date"
                                    className="form-control input-premium"
                                    value={overrideForm.endDate}
                                    onChange={(e) =>
                                      setOverrideForm({
                                        ...overrideForm,
                                        endDate: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            <div className="mt-4">
                              <button
                                type="submit"
                                className="btn-premium-save w-100"
                                disabled={individualLoading}
                              >
                                {individualLoading ? "Saving..." : "Apply Custom Limit"}
                              </button>
                            </div>
                          </form>
                        )}

                        {!selectedUser && (
                          <div className="empty-state">
                            <i
                              className="fas fa-search"
                              style={{ fontSize: "2.5rem", marginBottom: "15px" }}
                            ></i>
                            <p style={{ fontSize: "0.95rem" }}>
                              Search and select a member above to configure a custom limit override.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Overrides Table Card */}
                  <div className="col-12 col-lg-7 mb-4">
                    <div className="card glass-card h-100">
                      <div className="card-header">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Active Custom User Limits
                        </h4>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-custom m-0">
                            <thead>
                              <tr>
                                <th>User</th>
                                <th>Limit</th>
                                <th>Period</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeOverrides.length === 0 ? (
                                <tr>
                                  <td colSpan="4" className="empty-state">
                                    No custom overrides defined yet.
                                  </td>
                                </tr>
                              ) : (
                                activeOverrides.map((override) => {
                                  const u = override.userId;
                                  if (!u) return null;
                                  return (
                                    <tr key={override._id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          {u.avatar ? (
                                            <img
                                              className="user-avatar-img"
                                              src={u.avatar}
                                              alt={u.firstName}
                                              style={{ width: "32px", height: "32px" }}
                                            />
                                          ) : (
                                            <div
                                              className="user-avatar-placeholder"
                                              style={{
                                                width: "32px",
                                                height: "32px",
                                                fontSize: "0.8rem",
                                              }}
                                            >
                                              {u.firstName[0]}
                                            </div>
                                          )}
                                          <div>
                                            <div style={{ fontWeight: 600 }}>
                                              {u.firstName} {u.lastName}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                                              ID: {u.martrId}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="font-weight-bold" style={{ color: "#805AD5" }}>
                                          {override.count} Views
                                        </span>
                                      </td>
                                      <td>
                                        <span className="badge badge-light" style={{ textTransform: "capitalize" }}>
                                          {override.periodType}
                                        </span>
                                        {override.periodType === "custom" && (
                                          <div style={{ fontSize: "0.72rem", color: "#718096", marginTop: "2px" }}>
                                            {override.startDate?.substring(0, 10)} to{" "}
                                            {override.endDate?.substring(0, 10)}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn-action-circle btn-action-edit"
                                          title="Edit Override"
                                          onClick={() => handleSelectUser(u)}
                                        >
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn-action-circle btn-action-delete"
                                          title="Remove Override"
                                          onClick={() => handleDeleteOverride(u._id)}
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REQUEST SEND LIMITS */}
              {activeTab === "request-send" && (
                <div className="row animate-fade-in">
                  {/* Role-Based Request Limits (Free & Premium) */}
                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card glass-card card-accent-free h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Free Member Request Limit
                        </h4>
                        <span className="badge badge-primary badge-shadow">Free Role</span>
                      </div>
                      <form onSubmit={(e) => handleSaveRequestRoleLimits(e, "free")}>
                        <div className="card-body">
                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Request Send Limit Count</label>
                            <input
                              type="number"
                              className="form-control input-premium"
                              value={freeRequestLimitVal}
                              onChange={(e) => setFreeRequestLimitVal(Number(e.target.value))}
                              min="0"
                              max="9999"
                              required
                            />
                            <small className="form-text text-muted">
                              Number of connection requests a Free member is allowed to send.
                            </small>
                          </div>
                        </div>
                        <div className="card-footer text-right bg-transparent border-0 pt-0">
                          <button
                            type="submit"
                            className="btn-premium-save"
                            disabled={roleLoading}
                          >
                            {roleLoading ? "Updating..." : "Update Free Request Limit"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 mb-4">
                    <div className="card glass-card card-accent-premium h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Premium Member Request Limit
                        </h4>
                        <span className="badge badge-warning badge-shadow">Premium Role</span>
                      </div>
                      <form onSubmit={(e) => handleSaveRequestRoleLimits(e, "premium")}>
                        <div className="card-body">
                          <div className="form-group mb-4 d-flex flex-column">
                            <label className="form-label-custom">Request Send Limit Count</label>
                            <input
                              type="number"
                              className="form-control input-premium"
                              value={premiumRequestLimitVal}
                              onChange={(e) => setPremiumRequestLimitVal(Number(e.target.value))}
                              min="0"
                              max="9999"
                              required
                            />
                            <small className="form-text text-muted">
                              Number of connection requests a Premium member is allowed to send.
                            </small>
                          </div>
                        </div>
                        <div className="card-footer text-right bg-transparent border-0 pt-0">
                          <button
                            type="submit"
                            className="btn-premium-save"
                            disabled={roleLoading}
                          >
                            {roleLoading ? "Updating..." : "Update Premium Request Limit"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Individual Override Settings for Request Sends */}
                  <div className="col-12 col-lg-5 mb-4">
                    <div className="card glass-card card-accent-individual h-100">
                      <div className="card-header">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Add User Request Override
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="form-group search-container mb-4 d-flex flex-column">
                          <label className="form-label-custom">Search Member</label>
                          <input
                            type="text"
                            className="form-control input-premium"
                            placeholder="Search by Name, Email, or ID..."
                            value={requestSearchQuery}
                            onChange={(e) => setRequestSearchQuery(e.target.value)}
                          />
                          {requestSearchLoading && (
                            <small className="form-text text-muted mt-1">Searching...</small>
                          )}

                          {showRequestDropdown && requestSearchResults.length > 0 && (
                            <div className="search-results-dropdown" ref={requestDropdownRef}>
                              {requestSearchResults.map((user) => (
                                <div
                                  key={user._id}
                                  className="search-result-item"
                                  onClick={() => handleSelectRequestUser(user)}
                                >
                                  {user.avatar ? (
                                    <img
                                      className="user-avatar-img"
                                      src={user.avatar}
                                      alt={user.firstName}
                                    />
                                  ) : (
                                    <div className="user-avatar-placeholder">
                                      {user.firstName[0]}
                                    </div>
                                  )}
                                  <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {user.firstName} {user.lastName}
                                      <span
                                        className={`badge-premium-tag ${
                                          user.isSubscribed
                                            ? "badge-tag-subscribed"
                                            : "badge-tag-free"
                                        }`}
                                      >
                                        {user.isSubscribed ? "Premium" : "Free"}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: "0.78rem", color: "#718096" }}>
                                      ID: {user.martrId} | {user.email}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {selectedRequestUser && (
                          <div className="selected-user-banner animate-fade-in">
                            <div className="d-flex align-items-center">
                              {selectedRequestUser.avatar ? (
                                <img
                                  className="user-avatar-img"
                                  src={selectedRequestUser.avatar}
                                  alt={selectedRequestUser.firstName}
                                />
                              ) : (
                                <div className="user-avatar-placeholder">
                                  {selectedRequestUser.firstName[0]}
                                </div>
                              )}
                              <div>
                                <h6 className="m-0" style={{ fontWeight: 700 }}>
                                  {selectedRequestUser.firstName} {selectedRequestUser.lastName}
                                </h6>
                                <span style={{ fontSize: "0.75rem", color: "#718096" }}>
                                  ID: {selectedRequestUser.martrId}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: "8px" }}
                              onClick={() => setSelectedRequestUser(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {selectedRequestUser && (
                          <form onSubmit={handleSaveRequestOverride} className="animate-fade-in">
                            <div className="form-group mb-3 d-flex flex-column">
                              <label className="form-label-custom">Override Request Limit</label>
                              <input
                                type="number"
                                className="form-control input-premium"
                                value={requestOverrideForm.count}
                                onChange={(e) =>
                                  setRequestOverrideForm({
                                    ...requestOverrideForm,
                                    count: Number(e.target.value),
                                  })
                                }
                                min="0"
                                required
                              />
                            </div>

                            <div className="form-group mb-3 d-flex flex-column">
                              <label className="form-label-custom">Period Type</label>
                              <select
                                className="form-control input-premium"
                                value={requestOverrideForm.periodType}
                                onChange={(e) =>
                                  setRequestOverrideForm({
                                    ...requestOverrideForm,
                                    periodType: e.target.value,
                                  })
                                }
                              >
                                <option value="lifetime">Lifetime (No Reset)</option>
                                <option value="daily">Daily Reset</option>
                                <option value="weekly">Weekly Reset</option>
                                <option value="monthly">Monthly Reset</option>
                                <option value="yearly">Yearly Reset</option>
                                <option value="custom">Custom Date Range</option>
                              </select>
                            </div>

                            {requestOverrideForm.periodType === "custom" && (
                              <div className="row animate-fade-in mb-3">
                                <div className="col-6 form-group d-flex flex-column">
                                  <label className="form-label-custom">Start Date</label>
                                  <input
                                    type="date"
                                    className="form-control input-premium"
                                    value={requestOverrideForm.startDate}
                                    onChange={(e) =>
                                      setRequestOverrideForm({
                                        ...requestOverrideForm,
                                        startDate: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="col-6 form-group d-flex flex-column">
                                  <label className="form-label-custom">End Date</label>
                                  <input
                                    type="date"
                                    className="form-control input-premium"
                                    value={requestOverrideForm.endDate}
                                    onChange={(e) =>
                                      setRequestOverrideForm({
                                        ...requestOverrideForm,
                                        endDate: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            <div className="mt-4">
                              <button
                                type="submit"
                                className="btn-premium-save w-100"
                                disabled={requestIndividualLoading}
                              >
                                {requestIndividualLoading ? "Saving..." : "Apply Custom Request Limit"}
                              </button>
                            </div>
                          </form>
                        )}

                        {!selectedRequestUser && (
                          <div className="empty-state">
                            <i
                              className="fas fa-search"
                              style={{ fontSize: "2.5rem", marginBottom: "15px" }}
                            ></i>
                            <p style={{ fontSize: "0.95rem" }}>
                              Search and select a member above to configure a custom request limit override.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Request Overrides List */}
                  <div className="col-12 col-lg-7 mb-4">
                    <div className="card glass-card h-100">
                      <div className="card-header">
                        <h4 className="m-0" style={{ fontWeight: 700, color: "#2D3748" }}>
                          Active Custom Request Limits
                        </h4>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-custom m-0">
                            <thead>
                              <tr>
                                <th>User</th>
                                <th>Limit</th>
                                <th>Period</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeRequestOverrides.length === 0 ? (
                                <tr>
                                  <td colSpan="4" className="empty-state">
                                    No custom overrides defined yet.
                                  </td>
                                </tr>
                              ) : (
                                activeRequestOverrides.map((override) => {
                                  const u = override.userId;
                                  if (!u) return null;
                                  return (
                                    <tr key={override._id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          {u.avatar ? (
                                            <img
                                              className="user-avatar-img"
                                              src={u.avatar}
                                              alt={u.firstName}
                                              style={{ width: "32px", height: "32px" }}
                                            />
                                          ) : (
                                            <div
                                              className="user-avatar-placeholder"
                                              style={{
                                                width: "32px",
                                                height: "32px",
                                                fontSize: "0.8rem",
                                              }}
                                            >
                                              {u.firstName[0]}
                                            </div>
                                          )}
                                          <div>
                                            <div style={{ fontWeight: 600 }}>
                                              {u.firstName} {u.lastName}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                                              ID: {u.martrId}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="font-weight-bold" style={{ color: "#805AD5" }}>
                                          {override.count} Requests
                                        </span>
                                      </td>
                                      <td>
                                        <span className="badge badge-light" style={{ textTransform: "capitalize" }}>
                                          {override.periodType}
                                        </span>
                                        {override.periodType === "custom" && (
                                          <div style={{ fontSize: "0.72rem", color: "#718096", marginTop: "2px" }}>
                                            {override.startDate?.substring(0, 10)} to{" "}
                                            {override.endDate?.substring(0, 10)}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn-action-circle btn-action-edit"
                                          title="Edit Override"
                                          onClick={() => handleSelectRequestUser(u)}
                                        >
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn-action-circle btn-action-delete"
                                          title="Remove Override"
                                          onClick={() => handleDeleteRequestOverride(u._id)}
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Limits;
