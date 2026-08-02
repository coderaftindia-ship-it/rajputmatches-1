import axios from "axios";

const getDynamicBaseUrl = () => {
  const envUrl = process.env.REACT_APP_BASE_URL || process.env.VITE_APP_BASE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return `${protocol}//${hostname}:5000`;
    }
    return `${protocol}//${hostname}`;
  }
  return "http://localhost:5000";
};

const BASE_URL = getDynamicBaseUrl();
const API_PREFIX = "/api/v1";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("authToken");
      } catch (e) {}
      try {
        window.dispatchEvent(new Event("unauthorized-logout"));
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

/** Read payload from v1 response: { success, message, data } */
export function extractData(response) {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  return response?.data;
}

export function extractMessage(response) {
  return response?.data?.message || "";
}

export function getTokenFromResponse(response) {
  const data = extractData(response);
  return data?.token || response?.data?.token || null;
}

export function isSuccessResponse(response) {
  if (response?.data?.success === false) {
    return false;
  }
  return response?.status >= 200 && response?.status < 300;
}

export { BASE_URL };
