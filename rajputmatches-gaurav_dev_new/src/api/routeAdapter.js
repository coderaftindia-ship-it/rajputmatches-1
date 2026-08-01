import axios from "axios";
import { BASE_URL, extractData, apiClient } from "./client";
// meApi replaced by direct /auth/* calls in this adapter
import { mediaApi } from "./media.api";
import { profileApi } from "./profile.api";
import { publicApi } from "./public.api";
import { chatApi } from "./chat.api";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Maps old route strings to v1 GET handlers.
 * Returns the same shape components already expect.
 */
const GET_ROUTE_HANDLERS = {
  user: async () => {
    const response = await apiClient.get("/auth/user");
    return response.data?.user ?? extractData(response);
  },

  // helper used where backend may return 404 when a section hasn't been created yet
  profile: async () => {
    try {
      const res = await mediaApi.getAvatar();
      return extractData(res) ?? res.data?.user ?? null;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  files: async () => {
    try {
      const res = await mediaApi.getAlbum();
      return res.data?.user ?? extractData(res) ?? null;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  "get-professional-data": async () => {
    const response = await apiClient.get("/auth/get-professional-data");
    return response.data?.user ?? response.data ?? extractData(response);
  },

  "get-religiondetails": async () => {
    const response = await apiClient.get("/auth/get-religiondetails");
    return response.data?.user ?? response.data ?? extractData(response);
  },

  "get-family-details": async () => {
    const response = await apiClient.get("/auth/get-family-details");
    return response.data?.user ?? response.data ?? extractData(response);
  },

  "getpaternal-details": async () => {
    const response = await apiClient.get("/auth/getpaternal-details");
    return response.data?.user ?? response.data ?? extractData(response);
  },

  "profile/show-shortlisted": async () => {
    const response = await profileApi.getShortlists();
    return response.data?.user;
  },

  "profile/show-blocked": async () => {
    const response = await apiClient.get("/auth/profile/show-blocked");
    return response.data?.data;
  },

  "profile/viewed": async () => {
    const response = await profileApi.getVisited();
    return response.data?.user;
  },

  "profile/visited": async () => {
    const response = await profileApi.getVisitors();
    return response.data?.user;
  },

  "profile/myrequests": async () => {
    const response = await apiClient.get("/auth/profile/myrequests");
    return response.data?.user;
  },

  "profile/photorequests": async () => {
    const response = await apiClient.get("/auth/profile/photorequests");
    return response.data?.user;
  },

  "profile/documentrequests": async () => {
    const response = await apiClient.get("/auth/profile/documentrequests");
    return {
      documentReqSent: response.data?.documentReqSent ?? [],
      documentReqReceived: response.data?.documentReqReceived ?? [],
    };
  },

  "profile/contactrequests": async () => {
    const response = await apiClient.get("/auth/profile/contactrequests");
    return response.data?.user;
  },

  "profile/stories": async () => {
    const response = await apiClient.get("/auth/profile/stories");
    return response.data?.user ?? response.data;
  },

  "profile/reviews": async () => {
    const response = await apiClient.get("/auth/profile/reviews");
    return response.data?.user ?? response.data;
  },

  "chat/status": async () => chatApi.listPending(),

  "profile/clans": async () => {
    const response = await apiClient.get("/auth/profile/clans");
    return response.data;
  },
};

/**
 * Maps old route strings to v1 write handlers.
 */
const WRITE_ROUTE_HANDLERS = {
  "update-profile": (data) =>
    apiClient.put(`/auth/update-profile`, { data }),

  "save-professional-data": (data) =>
    apiClient.put(`/auth/save-professional-data`, { data }),

  "update-religiondetails": (data) =>
    apiClient.put(`/auth/update-religiondetails`, { data }),

  "update-family-details": (data) =>
    apiClient.put(`/auth/update-family-details`, { data }),

  "updatepaternal-details": (data) =>
    apiClient.put(`/auth/updatepaternal-details`, { data }),

  "update-privacy": (data) => mediaApi.updatePrivacy(data),

  "set-profile-image": (data) => mediaApi.setAvatar(data),

  "delete-image": (data) => mediaApi.deleteFile(data),

  getprofiles: (data) => profileApi.search(data),

  "profile/shortlist": (profileId) => profileApi.addShortlist(profileId),

  "profile/shortlisted/delete": (profileId) =>
    profileApi.removeShortlist(profileId),

  "profile/shortlisted/edit": (profileId) =>
    profileApi.toggleBookmark(profileId),

  "profile/view": (profileId) => profileApi.recordView(profileId),

  "profile/block-toggle": (profileId) =>
    apiClient.put("/auth/profile/block-toggle", { data: profileId }),

  "profile/photoRequest": (profileId) =>
    apiClient.put("/auth/profile/photoRequest", { data: profileId }),

  "profile/documentRequest": (profileId) =>
    apiClient.put("/auth/profile/documentRequest", { data: profileId }),

  "profile/document/accept": (profileId) =>
    apiClient.put("/auth/profile/document/accept", { data: profileId }),

  "profile/document/reject": (profileId) =>
    apiClient.put("/auth/profile/document/reject", { data: profileId }),

  "profile/document/withdrawal": (profileId) =>
    apiClient.put("/auth/profile/document/withdrawal", { data: profileId }),

  "profile/contactRequest": (profileId) =>
    apiClient.put("/auth/profile/contactRequest", { data: profileId }),

  "profile/contact/accept": (profileId) =>
    apiClient.put("/auth/profile/contact/accept", { data: profileId }),

  "profile/contact/reject": (profileId) =>
    apiClient.put("/auth/profile/contact/reject", { data: profileId }),

  "profile/contact/withdrawal": (profileId) =>
    apiClient.put("/auth/profile/contact/withdrawal", { data: profileId }),

  "profile/accept": (profileId) =>
    apiClient.put("/auth/profile/accept", { data: profileId }),

  "profile/reject": (profileId) =>
    apiClient.put("/auth/profile/reject", { data: profileId }),

  "profile/reqsent/accept": (profileId) =>
    apiClient.put("/auth/profile/reqsent/accept", { data: profileId }),

  "profile/reqsent/reject": (profileId) =>
    apiClient.put("/auth/profile/reqsent/reject", { data: profileId }),

  "profile/request": (profileId) =>
    apiClient.put("/auth/profile/request", { data: profileId }),

  "profile/withdrawal": (profileId) =>
    apiClient.put("/auth/profile/withdrawal", { data: profileId }),

  "profile/reqsent/withdrawal": (profileId) =>
    apiClient.put("/auth/profile/reqsent/withdrawal", { data: profileId }),

  "profile/message": (data) =>
    apiClient.put("/auth/profile/message", { data }),

  "chat/status/update": ({ chatId, action }) =>
    chatApi.updateStatus(chatId, action),

  contactus: (data) => publicApi.submitContact(data),
};

export async function fetchByRoute(route) {
  if (route.startsWith("profile/view/images/")) {
    const profileId = route.split("/").pop();
    const response = await profileApi.getPhotos(profileId);
    return response.data?.user ?? extractData(response);
  }

  if (route.startsWith("profile/view/")) {
    const profileId = route.replace("profile/view/", "");
    const response = await profileApi.getDetails(profileId);
    return response.data?.user ?? extractData(response);
  }

  const handler = GET_ROUTE_HANDLERS[route];

  if (handler) {
    return handler();
  }

  const response = await apiClient.get(`/${route}`);
  return response.data?.user ?? response.data;
}

export async function updateByRoute(route, data) {
  const handler = WRITE_ROUTE_HANDLERS[route];

  if (handler) {
    const response = await handler(data);
    return response.data;
  }

  const response = await apiClient.put(`/${route}`, { data });
  return response.data;
}

export { GET_ROUTE_HANDLERS, WRITE_ROUTE_HANDLERS };
