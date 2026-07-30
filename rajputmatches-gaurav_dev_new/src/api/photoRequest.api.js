import { apiClient } from "./client";

export const photoRequestApi = {
  list: () => apiClient.get("/photo-requests"),

  send: (profileId) => apiClient.post("/photo-requests", { data: profileId }),

  withdraw: (profileId) =>
    apiClient.delete("/photo-requests", { data: profileId }),

  accept: (profileId) =>
    apiClient.post("/photo-requests/accept", { data: profileId }),

  reject: (profileId) =>
    apiClient.post("/photo-requests/reject", { data: profileId }),

  remove: (profileId) =>
    apiClient.delete("/photo-requests/remove", { data: profileId }),
};
