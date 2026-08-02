import React, { useState, useEffect } from "react";
import Profilenavbar from "./Profilenavbar";
import { useAuth } from "../../Layout/AuthContext";
import { apiClient } from "../../../api/client";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaPowerOff, FaSpinner } from "react-icons/fa";
import styles from "./Settings.module.css";

function Settings() {
  const { updateData, fetchUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Using "user" route in fetchUserData to get latest info
        const data = await fetchUserData("user");
        setProfile(data);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Handle visibility toggle
  const handleVisibilityToggle = async () => {
    if (!profile) return;
    try {
      const nextValue = !profile.isVisible;
      setProfile({ ...profile, isVisible: nextValue });
      
      // Call updateData with update-profile route
      await updateData("update-profile", { isVisible: nextValue }, true);
      toast.success(
        nextValue ? "Profile is now visible to others!" : "Profile is now hidden."
      );
    } catch (err) {
      toast.error("Failed to update profile visibility.");
      console.error(err);
    }
  };

  // Handle activation toggle
  const handleActivationToggle = async () => {
    if (!profile) return;
    try {
      const nextValue = !profile.isEnable;
      setProfile({ ...profile, isEnable: nextValue });

      await updateData("update-profile", { isEnable: nextValue }, true);
      toast.success(
        nextValue ? "Account activated successfully." : "Account deactivated."
      );
    } catch (err) {
      toast.error("Failed to update account status.");
      console.error(err);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warn("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setPasswordLoading(true);
      const res = await apiClient.post("/auth/reset-password", {
        password: oldPassword,
        newPassword: newPassword,
      });
      if (res.data?.success) {
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data?.message || "Failed to reset password.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles.settingsPageContainer}>
      <Profilenavbar />
      
      <div className={styles.settingsWrapper}>
        <h2 className={styles.settingsTitle}>Settings & Privacy</h2>
        
        {loading ? (
          <div className={styles.loadingSpinner}>
            <FaSpinner className="spin" size={40} color="#991c1c" />
            <p>Loading settings...</p>
          </div>
        ) : (
          <div className={styles.gridContainer}>
            
            {/* Privacy Card */}
            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <FaEye className={styles.cardIcon} />
                <h3>Profile Visibility</h3>
              </div>
              <p className={styles.cardDesc}>
                Control who can view your profile on Rajput Alliances. When hidden, you will not appear in searches.
              </p>
              <div className={styles.switchWrapper}>
                <span className={styles.statusLabel}>
                  Status: <strong>{profile?.isVisible ? "Visible" : "Hidden"}</strong>
                </span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={profile?.isVisible ?? true}
                    onChange={handleVisibilityToggle}
                  />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
              </div>
            </div>

            {/* Account Settings Card */}
            <div className={styles.settingsCard}>
              <div className={styles.cardHeader}>
                <FaPowerOff className={styles.cardIcon} />
                <h3>Account Activation</h3>
              </div>
              <p className={styles.cardDesc}>
                Deactivate your account if you want to temporarily freeze your activity on the platform.
              </p>
              <div className={styles.switchWrapper}>
                <span className={styles.statusLabel}>
                  Status: <strong>{profile?.isEnable ? "Active" : "Deactivated"}</strong>
                </span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={profile?.isEnable ?? true}
                    onChange={handleActivationToggle}
                  />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
              </div>
            </div>

            {/* Password Reset Card */}
            <div className={`${styles.settingsCard} ${styles.passwordCard}`}>
              <div className={styles.cardHeader}>
                <FaLock className={styles.cardIcon} />
                <h3>Change Password</h3>
              </div>
              <form onSubmit={handlePasswordReset} className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="oldPassword">Current Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? <FaSpinner className="spin" /> : "Update Password"}
                </button>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
