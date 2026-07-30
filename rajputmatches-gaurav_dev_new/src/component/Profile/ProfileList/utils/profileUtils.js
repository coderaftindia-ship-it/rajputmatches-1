/**
 * Calculate age from date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Calculate height in inches from feet and inches object
 * @param {Object} height - Height object with feet and inches
 * @returns {number} Total height in inches
 */
export const calculateHeightInInches = (height) => {
  if (!height) return 0;
  return (height.feet || 0) * 12 + (height.inches || 0);
};

/**
 * Format height for display
 * @param {Object} height - Height object with feet and inches
 * @returns {string} Formatted height string
 */
export const formatHeight = (height) => {
  if (!height) return "N/A";
  return `${height.feet || 0}' ${height.inches || 0}"`;
};

/**
 * Get profile detail value safely
 * @param {Object} profile - Profile object
 * @param {string} path - Dot notation path to value
 * @returns {any} Value or "N/A"
 */
export const getProfileValue = (profile, path) => {
  const value = path.split('.').reduce((obj, key) => obj?.[key], profile);
  return value || "N/A";
};
