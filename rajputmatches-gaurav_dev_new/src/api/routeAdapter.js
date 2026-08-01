import { extractData, apiClient } from "./client";

/**
 * Maps old route strings to v1 GET handlers.
 * Returns the same shape components already expect.
 */
const GET_ROUTE_HANDLERS = {
  user: async () => {
    const response = await apiClient.get("/auth/user");
    return response.data?.user ?? extractData(response);
  },

  profile: async () => {
    try {
      const res = await apiClient.get("/auth/profile");
      return extractData(res) ?? res.data?.user ?? null;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  files: async () => {
    try {
      const res = await apiClient.get("/auth/files");
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
    const response = await apiClient.get("/auth/profile/show-shortlisted");
    return response.data?.user;
  },

  "profile/show-blocked": async () => {
    const response = await apiClient.get("/auth/profile/show-blocked");
    return response.data?.data;
  },

  "profile/viewed": async () => {
    const response = await apiClient.get("/auth/profile/viewed");
    return response.data?.user;
  },

  "profile/visited": async () => {
    const response = await apiClient.get("/auth/profile/visited");
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

  "chat/status": async () => {
    const response = await apiClient.get("/chat/status");
    return response.data;
  },

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

  "update-privacy": (data) =>
    apiClient.put("/auth/update-privacy", { data }),

  "set-profile-image": (data) =>
    apiClient.put("/auth/set-profile-image", { data }),

  "delete-image": (data) =>
    apiClient.put("/auth/delete-image", { data }),

  getprofiles: (data) =>
    apiClient.put("/auth/getprofiles", { data }),

  "profile/shortlist": (profileId) =>
    apiClient.put("/auth/profile/shortlist", { data: profileId }),

  "profile/shortlisted/delete": (profileId) =>
    apiClient.put("/auth/profile/shortlisted/delete", { data: profileId }),

  "profile/shortlisted/edit": (profileId) =>
    apiClient.put("/auth/profile/shortlisted/edit", { data: profileId }),

  "profile/view": (profileId) =>
    apiClient.put("/auth/profile/view", { data: profileId }),

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
    apiClient.put("/chat/status", { chatId, action }),

  contactus: (data) =>
    apiClient.post("/public/contact", { data }),
};

export async function fetchByRoute(route) {
  if (route.startsWith("profile/view/images/")) {
    const profileId = route.split("/").pop();
    const response = await apiClient.get(`/auth/profile/view/images/${profileId}`);
    return response.data?.user ?? extractData(response);
  }

  if (route.startsWith("profile/view/")) {
    const profileId = route.replace("profile/view/", "");
    const response = await apiClient.get(`/auth/profile/view/${profileId}`);
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
