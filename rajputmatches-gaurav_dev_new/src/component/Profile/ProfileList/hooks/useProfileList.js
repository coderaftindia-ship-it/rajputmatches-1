import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../Layout/AuthContext";

/**
 * Custom hook for managing profile lists with pagination, sorting, and filtering
 * @param {string} apiRoute - API endpoint to fetch data
 * @param {string} dataKey - Key to extract profiles from API response
 * @param {number} itemsPerPage - Number of items per page (default: 4)
 */
export const useProfileList = (apiRoute, dataKey = null, itemsPerPage = 4) => {
  const { fetchUserData } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserData(apiRoute);
      
      // Extract profiles based on dataKey or use data directly
      const extractedProfiles = dataKey ? data[dataKey] : data;
      
      if (!extractedProfiles || !Array.isArray(extractedProfiles)) {
        throw new Error("Invalid data format");
      }
      
      setProfiles(extractedProfiles);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [apiRoute, dataKey, fetchUserData]);

  // Refresh data
  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Pagination
  const totalPages = Math.ceil(profiles.length / itemsPerPage);

  const getCurrentPageProfiles = useCallback(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return profiles.slice(startIdx, startIdx + itemsPerPage);
  }, [profiles, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  // Fetch data on mount and when refreshKey changes
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  return {
    profiles,
    setProfiles,
    loading,
    error,
    currentPage,
    totalPages,
    getCurrentPageProfiles,
    goToPage,
    nextPage,
    prevPage,
    refreshData,
    fetchData,
  };
};
