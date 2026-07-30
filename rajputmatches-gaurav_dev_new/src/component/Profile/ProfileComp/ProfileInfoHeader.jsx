import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useAuth } from "../../Layout/AuthContext";
import { useOptionalProfileDetails } from "../../../context/ProfileDetailsContext";
import { Calendar, Phone, Mail, BadgeCheck, Printer } from "lucide-react";

const ProfileInfoHeader = () => {
  const { fetchUserData, profile, fetchprofile, userData: authUserData } = useAuth();
  const profileDetails = useOptionalProfileDetails();
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchprofile();
  }, []);

  const avatarUrl =
    authUserData?.avatar ||
    (profile && !profile.includes("user-icon-flat-isolated") ? profile : null);

  const initials = `${(authUserData?.firstName || "").charAt(0)}${(authUserData?.lastName || "").charAt(0)}`.toUpperCase();

  const applyUserData = (Data) => {
    const formattedDateOfBirth = Data?.dateOfBirth
      ? Data.dateOfBirth.split("T")[0]
      : "";

    setUserData({
      firstName: Data?.firstName || "",
      middleName: Data?.middleName || "",
      lastName: Data?.lastName || "",
      dateOfBirth: formattedDateOfBirth,
      mobile: Data?.mobile || "",
      email: Data?.email || "",
      martrId: Data?.martrId || "",
    });
  };

  const fetchData = async () => {
    try {
      setError("");
      const Data = await fetchUserData("user");
      applyUserData(Data);
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
    }
  };

  useEffect(() => {
    if (profileDetails?.user) {
      applyUserData(profileDetails.user);
      return;
    }
    if (profileDetails) return;
    fetchData();
  }, [profileDetails?.user, profileDetails]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const fullName = [userData?.firstName, userData?.middleName, userData?.lastName]
    .filter(Boolean)
    .join(" ");
  const age = calculateAge(userData?.dateOfBirth);
  const formattedDob = formatDate(userData?.dateOfBirth);

  return (
    /* Single unified wrapper — cover banner + overlapping avatar + info card */
    <div style={{ position: "relative", marginBottom: "16px" }}>

      {/* ── Cover Banner ── */}
      <div
        className={styles.profileHeader}
        style={{ position: "relative" }}
      >
        {/* Dark gradient fade at the bottom of the banner */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(80,10,10,0.22) 100%)",
            borderRadius: "16px 16px 0 0",
            pointerEvents: "none",
          }}
        />

        {/* Print button top-right */}
        <button
          onClick={() => window.print()}
          title="Print Profile"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            color: "#991c1c",
          }}
        >
          <Printer size={13} />
          Print
        </button>

        {/* ── Avatar — anchored to bottom of the banner, overflows downward ── */}
        <div
          style={{
            position: "absolute",
            bottom: -55,
            left: 28,
            zIndex: 20,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              style={{
                width: 116,
                height: 116,
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid white",
                boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: 116,
                height: 116,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #991c1c 0%, #59123B 100%)",
                border: "5px solid white",
                boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {initials || "U"}
            </div>
          )}
        </div>
      </div>

      {/* ── Info Card — content starts after the avatar width ── */}
      <div
        style={{
          background: "white",
          borderRadius: "0 0 16px 16px",
          border: "1px solid rgba(212,175,55,0.15)",
          borderTop: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          paddingTop: 68,
          paddingBottom: 24,
          paddingLeft: 160,  /* starts after avatar (28px margin + 116px avatar + 16px gap) */
          paddingRight: 28,
          position: "relative",
        }}
      >
        {/* Full name */}
        <h1
          style={{
            fontFamily: "Lustria, serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#1a1a2e",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          {fullName || "Your Name"}
        </h1>

        {/* Matri ID + Age badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 12px",
              borderRadius: 30,
              background: "linear-gradient(135deg, rgba(153,28,28,0.09), rgba(212,175,55,0.1))",
              border: "1px solid rgba(153,28,28,0.2)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#991c1c",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <BadgeCheck size={13} />
            Matri ID: {userData?.martrId || "—"}
          </span>

          {age !== "N/A" && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: 30,
                background: "rgba(107,114,128,0.1)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {age} Yrs
            </span>
          )}
        </div>

        {/* Contact chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {/* Birth Date */}
          {formattedDob && formattedDob !== "N/A" && (
            <ContactChip icon={<Calendar size={13} />} label="Birth Date" value={formattedDob} />
          )}
          {userData?.mobile && (
            <ContactChip icon={<Phone size={13} />} label="Mobile" value={userData.mobile} />
          )}
          {userData?.email && (
            <ContactChip icon={<Mail size={13} />} label="Email" value={userData.email} />
          )}
        </div>
      </div>
    </div>
  );
};

/* Small reusable chip */
function ContactChip({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        background: "#fdf6ec",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: 10,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #991c1c 0%, #59123B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <span
          style={{
            fontSize: "0.68rem",
            color: "#6b7280",
            fontWeight: 600,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.88rem",
            color: "#1a1a2e",
            fontWeight: 600,
            display: "block",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "N/A";
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default ProfileInfoHeader;
