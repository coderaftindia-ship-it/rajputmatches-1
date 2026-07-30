import { apiClient } from "./client";

export const mediaApi = {
  getAlbum: () => apiClient.get("/auth/files"),

  getAvatar: () => apiClient.get("/auth/profile"),

  uploadPhotos: (formData) => apiClient.post("/auth/upload-files", formData),

  uploadDocuments: (formData) => apiClient.post("/auth/upload-documents", formData),

  setAvatar: (photoId) => apiClient.put("/auth/set-profile-image", { data: photoId }),

  deleteFile: (fileId) => apiClient.put("/auth/delete-image", { data: fileId }),

  updatePrivacy: (isPrivate) => apiClient.put("/auth/update-privacy", { data: isPrivate }),
};
