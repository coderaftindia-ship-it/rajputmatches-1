import { apiClient } from "./client";

export const publicApi = {
  submitContact: (formData) =>
    apiClient.post("/public/contact", { data: formData }),

  getPage: (slug) => apiClient.get(`/public/pages/${slug}`),

  getRecentProfiles: () => apiClient.get("/auth/public/recent-profiles"),

  getAbout: () => apiClient.get("/auth/about"),

  getHomeCMS: () => apiClient.get("/auth/home-cms"),

  getContactCMS: () => apiClient.get("/auth/contact-cms"),

  getStoriesCMS: () => apiClient.get("/auth/stories-cms"),

  getSiteSettings: () => apiClient.get("/auth/site-settings"),
};
