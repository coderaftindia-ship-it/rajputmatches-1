import { apiClient } from './apiClient';

export const mediaApi = {
  // POST /api/v1/auth/upload-files  — upload photos to album (multipart)
  uploadPhotos: (files: any[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post('/auth/upload-files', formData, true);
  },

  // POST /api/v1/auth/upload-documents  — upload documents (multipart)
  uploadDocuments: (files: any[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post('/auth/upload-documents', formData, true);
  },

  // GET /api/v1/auth/files  — get all uploaded photos and documents
  getAlbum: () => apiClient.get('/auth/files'),

  // GET /api/v1/auth/profile  — get current avatar / profile photo
  getAvatar: () => apiClient.get('/auth/profile'),

  // PUT /api/v1/auth/set-profile-image  — set a photo as profile avatar
  setAvatar: (photoId: string) =>
    apiClient.put('/auth/set-profile-image', { data: photoId }),

  // PUT /api/v1/auth/delete-image  — delete a photo by ID
  deletePhoto: (photoId: string) =>
    apiClient.put('/auth/delete-image', { data: photoId }),

  // PUT /api/v1/auth/update-privacy  — toggle album privacy
  updatePrivacy: (isPrivate: boolean) =>
    apiClient.put('/auth/update-privacy', { isPrivate }),
};

export default mediaApi;
