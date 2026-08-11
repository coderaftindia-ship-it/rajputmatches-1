import { apiClient } from './apiClient';

export const chatApi = {
  // GET /api/v1/auth/message/chat  — all chat conversations
  listChats: () => apiClient.get('/auth/message/chat'),

  // GET /api/v1/auth/chat/status  — pending / unread chat status
  getChatStatus: () => apiClient.get('/auth/chat/status'),

  // PUT /api/v1/auth/message  — fetch messages for a chat
  getMessages: (chatId: string) =>
    apiClient.put('/auth/message', { chatId }),

  // POST /api/v1/auth/message/send  — send a text message
  sendMessage: (chatId: string, message: string) =>
    apiClient.post('/auth/message/send', { chatId, message }),

  // POST /api/v1/auth/message/send-file  — send file / media message
  sendFileMessage: (chatId: string, file: any, message?: string) => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    if (file) formData.append('file', file);
    if (message) formData.append('message', message);
    return apiClient.post('/auth/message/send-file', formData, true);
  },

  // POST /api/v1/auth/delete/message  — delete all messages in a chat
  deleteMessages: (chatId: string, deleteForAll = false) =>
    apiClient.post('/auth/delete/message', { chatId, deleteForAll }),

  // POST /api/v1/auth/delete/single-message  — delete a single message
  deleteSingleMessage: (messageId: string, deleteForAll = false) =>
    apiClient.post('/auth/delete/single-message', { messageId, deleteForAll }),

  // PUT /api/v1/auth/chat/status/update  — mark chat as read/accepted
  updateStatus: (chatId: string, status: string) =>
    apiClient.put('/auth/chat/status/update', { chatId, status }),

  // PUT /api/v1/auth/profile/message  — create or get chat with a user
  createOrGetChat: (profileId: string) =>
    apiClient.put('/auth/profile/message', { user2: profileId }),
};

export default chatApi;
