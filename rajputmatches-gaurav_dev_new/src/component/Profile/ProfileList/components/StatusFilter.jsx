import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Status Filter Dropdown
 */
const StatusFilter = ({ value, onChange }) => {
  return (
    <select
      className="form-select form-select-lg m-0"
      style={{
        color: "rgba(97, 97, 97, 1)",
        borderRadius: "0%",
        border: "1px solid rgba(97, 97, 97, 1)",
        padding: "0.5rem 1rem",
        fontFamily: "Open Sans, sans-serif",
        fontWeight: "600",
        fontSize: "clamp(8px, 11px, 14px)",
        outline: "none",
        wordWrap: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      aria-label="Filter by status"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All request</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
};

StatusFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StatusFilter;
