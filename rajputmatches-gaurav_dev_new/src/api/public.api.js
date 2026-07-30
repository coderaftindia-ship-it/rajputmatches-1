import { apiClient } from "./client";

export const publicApi = {
  submitContact: (formData) =>
    apiClient.post("/public/contact", { data: formData }),

  getPage: (slug) => apiClient.get(`/public/pages/${slug}`),

  getRecentProfiles: () => apiClient.get("/auth/public/recent-profiles"),
};
