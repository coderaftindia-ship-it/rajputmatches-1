import { apiClient } from "./client";

export const profileApi = {
  search: (filters) => apiClient.put("/auth/getprofiles", { data: filters }),

  getSummary: (profileId) =>
    apiClient.get(`/auth/profile/view/${profileId}`),

  getDetails: (profileId) => apiClient.get(`/auth/profile/view/${profileId}`),

  getPhotos: (profileId) => apiClient.get(`/auth/profile/view/images/${profileId}`),

  recordView: (profileId) => apiClient.put("/auth/profile/view", { data: profileId }),

  getShortlists: () => apiClient.get("/auth/profile/show-shortlisted"),

  getVisited: () => apiClient.get("/auth/profile/viewed"),

  getVisitors: () => apiClient.get("/auth/profile/visited"),

  addShortlist: (profileId) =>
    apiClient.put("/auth/profile/shortlist", { data: profileId }),

  removeShortlist: (profileId) =>
    apiClient.put("/auth/profile/shortlisted/delete", { data: profileId }),

  toggleBookmark: (profileId) =>
    apiClient.put("/auth/profile/shortlisted/edit", { data: profileId }),
};
