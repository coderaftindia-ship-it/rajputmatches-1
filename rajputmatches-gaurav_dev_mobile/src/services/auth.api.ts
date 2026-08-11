import { apiClient } from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  gender?: string;
  age?: number | string;
  gotra?: string;
  education?: string;
  location?: string;
  [key: string]: any;
}

export interface LoginPayload {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  [key: string]: any;
}

export const authApi = {
  // POST /api/v1/auth/register
  register: (body: RegisterPayload) => apiClient.post('/auth/register', body),

  // POST /api/v1/auth/login — accepts username (email or mobile number)
  login: (body: LoginPayload) => {
    const username = (body.username || body.email || body.mobile || '').trim();
    return apiClient.post('/auth/login', { username, password: body.password });
  },

  // GET /api/v1/auth/user — returns logged-in user data
  getCurrentUser: () => apiClient.get('/auth/user'),

  // POST /api/v1/auth/forgot-password
  forgotPassword: (body: { email?: string; username?: string }) => {
    const username = (body.username || body.email || '').trim();
    return apiClient.post('/auth/forgot-password', { username });
  },

  // POST /api/v1/auth/reset-password (requires auth)
  resetPassword: (body: { password: string; [key: string]: any }) =>
    apiClient.post('/auth/reset-password', body),

  // POST /api/v1/auth/send-verification-otp
  sendVerificationOtp: (body: { email: string }) =>
    apiClient.post('/auth/send-verification-otp', body),

  // POST /api/v1/auth/email/send-verification
  sendVerification: (body: { email: string }) =>
    apiClient.post('/auth/email/send-verification', body),

  // POST /api/v1/auth/email/verify-otp
  verifyEmailOtp: (body: { email: string; otp: string }) =>
    apiClient.post('/auth/email/verify-otp', body),

  // POST /api/v1/auth/verify-otp
  verifyOtp: (body: { email?: string; mobile?: string; otp: string }) =>
    apiClient.post('/auth/verify-otp', body),

  // PUT /api/v1/auth/update-profile — update basic user details
  updateProfile: (body: Record<string, any>) =>
    apiClient.put('/auth/update-profile', body),

  // GET /api/v1/auth/site-settings — public site branding
  getSiteSettings: () => apiClient.get('/auth/site-settings'),

  // GET /api/v1/auth/social-links — public social media links
  getSocialLinks: () => apiClient.get('/auth/social-links'),

  // POST /api/v1/auth/logout
  logout: () => apiClient.post('/auth/logout', {}),
};

export default authApi;
