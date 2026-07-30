import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Sort Filters Component
 */
const SortFilters = ({ sortConfig, onSortChange }) => {
  return (
    <div className="filters">
      {["age", "height"].map((criteria) => (
        <select
          key={criteria}
          value={
            sortConfig.criteria === criteria ? sortConfig.direction : "asc"
          }
          onChange={(e) =>
            onSortChange({ criteria, direction: e.target.value })
          }
          className="form-select form-select-lg p-2 filterItem"
          aria-label={`Sort by ${criteria}`}
        >
          <option value="asc">
            {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
          </option>
          <option value="asc">Increasing</option>
          <option value="desc">Decreasing</option>
        </select>
      ))}
    </div>
  );
};

SortFilters.propTypes = {
  sortConfig: PropTypes.shape({
    criteria: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default SortFilters;
