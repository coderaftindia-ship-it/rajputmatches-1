import { apiClient, extractData } from "./client";
import { fetchByRoute } from "./routeAdapter";

/** Legacy chat handlers return a raw array; v1 may wrap in { data }. */
function unwrapList(response) {
  const data = extractData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export const chatApi = {
  listChats: async () => fetchByRoute("chat/list"),

  listPending: async () => unwrapList(await apiClient.get("/auth/chat/status")),

  getMessages: async (chatId) =>
    unwrapList(
      await apiClient.put("/auth/message", { chatId })
    ),

  sendMessage: (chatId, message) =>
    apiClient.post("/auth/message/send", { chatId, message }),

  sendFileMessage: (chatId, file, message = "") => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("message", message);
    formData.append("avatar", file); // Must be 'avatar' for backend middleware
    return apiClient.post("/auth/message/send-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteMessages: (chatId, deleteForAll = false) =>
    apiClient.post("/auth/delete/message", { chatId, deleteForAll }),

  deleteSingleMessage: (messageId, deleteForAll = false) =>
    apiClient.post("/auth/delete/single-message", { messageId, deleteForAll }),

  updateStatus: (chatId, status) =>
    apiClient.put("/auth/chat/status/update", { data: { chatId, action: status } }),

  validateParticipant: (profileId) =>
    apiClient.put("/auth/profile/message", { data: { user2: profileId, message: "Hi" } }),
};
