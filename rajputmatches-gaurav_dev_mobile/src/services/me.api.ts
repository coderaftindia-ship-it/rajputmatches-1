import { apiClient } from './apiClient';

export const meApi = {
  // GET /api/v1/auth/user  — logged-in user basic info
  getProfile: () => apiClient.get('/auth/user'),

  // PUT /api/v1/auth/update-profile  — update basic profile fields
  updateProfile: (fields: Record<string, any>) =>
    apiClient.put('/auth/update-profile', fields),

  // GET /api/v1/auth/get-professional-data
  getProfessional: () => apiClient.get('/auth/get-professional-data'),

  // PUT /api/v1/auth/save-professional-data
  updateProfessional: (fields: Record<string, any>) =>
    apiClient.put('/auth/save-professional-data', fields),

  // GET /api/v1/auth/get-religiondetails  — gotra, religion, etc.
  getReligion: () => apiClient.get('/auth/get-religiondetails'),

  // PUT /api/v1/auth/update-religiondetails
  updateReligion: (fields: Record<string, any>) =>
    apiClient.put('/auth/update-religiondetails', fields),

  // GET /api/v1/auth/get-family-details
  getFamily: () => apiClient.get('/auth/get-family-details'),

  // PUT /api/v1/auth/update-family-details
  updateFamily: (fields: Record<string, any>) =>
    apiClient.put('/auth/update-family-details', fields),

  // GET /api/v1/auth/getpaternal-details  — extended / paternal family
  getExtendedFamily: () => apiClient.get('/auth/getpaternal-details'),

  // PUT /api/v1/auth/updatepaternal-details
  updateExtendedFamily: (fields: Record<string, any>) =>
    apiClient.put('/auth/updatepaternal-details', fields),

  // GET /api/v1/auth/files  — user's photo & document album
  getFiles: () => apiClient.get('/auth/files'),

  // GET /api/v1/auth/profile  — avatar / profile image
  getAvatar: () => apiClient.get('/auth/profile'),

  // PUT /api/v1/auth/set-profile-image  — set avatar photo
  setAvatar: (photoId: string) =>
    apiClient.put('/auth/set-profile-image', { data: photoId }),

  // PUT /api/v1/auth/delete-image  — delete a photo
  deletePhoto: (photoId: string) =>
    apiClient.put('/auth/delete-image', { data: photoId }),

  // PUT /api/v1/auth/update-privacy  — set photos to private/public
  updatePrivacy: (isPrivate: boolean) =>
    apiClient.put('/auth/update-privacy', { isPrivate }),
};

export default meApi;
