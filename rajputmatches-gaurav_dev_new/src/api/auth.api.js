import { apiClient } from "./client";

export const authApi = {
  register: (body) => apiClient.post("/auth/register", body),

  login: (body) => apiClient.post("/auth/login", body),

  logout: () => apiClient.post("/auth/logout"),

  forgotPassword: (body) => apiClient.post("/auth/forgot-password", body),

  resetPassword: (body) => apiClient.post("/auth/reset-password", body),

  sendVerification: (body) => apiClient.post("/auth/email/send-verification", body),

  verifyOtp: (body) => apiClient.post("/auth/email/verify-otp", body),

  verifyEmail: (token) =>
    apiClient.get("/auth/email/verify", { params: { token } }),
};
