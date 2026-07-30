import { apiClient } from "./client";

export const connectionRequestApi = {
  list: () => apiClient.get("/connection-requests"),

  send: (profileId) =>
    apiClient.post("/connection-requests", { data: profileId }),

  withdraw: (profileId) =>
    apiClient.delete("/connection-requests/sent", { data: profileId }),

  accept: (profileId) =>
    apiClient.post("/connection-requests/accept", { data: profileId }),

  reject: (profileId) =>
    apiClient.post("/connection-requests/reject", { data: profileId }),

  removeSent: (profileId) =>
    apiClient.delete("/connection-requests/sent/remove", { data: profileId }),

  removeReceived: (profileId) =>
    apiClient.delete("/connection-requests/received/remove", {
      data: profileId,
    }),
};
