import { useState, useCallback } from "react";
import { calculateAge, calculateHeightInInches } from "../utils/profileUtils";

/**
 * Custom hook for sorting profiles by age or height
 * @param {Array} profiles - Array of profiles to sort
 * @param {Function} setProfiles - State setter for profiles
 */
export const useSorting = (profiles, setProfiles) => {
  const [sortConfig, setSortConfig] = useState({
    criteria: "",
    direction: "asc",
  });

  const sortProfiles = useCallback(
    (criteria) => {
      const newDirection =
        sortConfig.criteria === criteria && sortConfig.direction === "asc"
          ? "desc"
          : "asc";

      const sorted = [...profiles].sort((a, b) => {
        let valueA, valueB;

        if (criteria === "age") {
          valueA = calculateAge(a.dateOfBirth || a.userId?.dateOfBirth);
          valueB = calculateAge(b.dateOfBirth || b.userId?.dateOfBirth);
        } else if (criteria === "height") {
          valueA = calculateHeightInInches(a.height || a.userId?.height);
          valueB = calculateHeightInInches(b.height || b.userId?.height);
        }

        return newDirection === "asc" ? valueA - valueB : valueB - valueA;
      });

      setProfiles(sorted);
      setSortConfig({ criteria, direction: newDirection });
    },
    [profiles, setProfiles, sortConfig]
  );

  const setSortDirection = useCallback((config) => {
    setSortConfig(config);
  }, []);

  return {
    sortConfig,
    sortProfiles,
    setSortDirection,
  };
};
