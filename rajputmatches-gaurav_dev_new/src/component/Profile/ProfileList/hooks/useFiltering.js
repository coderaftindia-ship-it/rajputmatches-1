import { useState, useCallback } from "react";

/**
 * Custom hook for filtering profiles by status
 * @param {Array} allProfiles - Complete array of profiles
 * @param {Function} setDisplayedProfiles - State setter for displayed profiles
 */
export const useFiltering = (allProfiles, setDisplayedProfiles) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filterByStatus = useCallback(
    (status) => {
      setStatusFilter(status);
      
      if (status === "all") {
        setDisplayedProfiles(allProfiles);
      } else {
        const filtered = allProfiles.filter(
          (profile) => profile.status === status
        );
        setDisplayedProfiles(filtered);
      }
    },
    [allProfiles, setDisplayedProfiles]
  );

  return {
    statusFilter,
    filterByStatus,
  };
};
