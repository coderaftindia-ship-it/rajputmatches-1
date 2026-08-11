import { apiClient } from './apiClient';

export interface SearchFilters {
  gender?: string;
  minAge?: number | string;
  maxAge?: number | string;
  gotra?: string;
  education?: string;
  location?: string;
  maritalStatus?: string;
  searchQuery?: string;
  [key: string]: any;
}

export const profileApi = {
  // GET logged in user profile
  getProfile: () => apiClient.get('/auth/user'),

  // PUT /api/v1/auth/getprofiles — search/filter profiles (expects { data: filters })
  search: (filters: SearchFilters = {}) =>
    apiClient.put('/auth/getprofiles', { data: filters }),

  // GET /api/v1/auth/public/recent-profiles — public profiles for guest / homepage
  getRecentPublic: () => apiClient.get('/auth/public/recent-profiles'),

  // GET /api/v1/auth/profile/view/:id — full profile details
  getDetails: (profileId: string) =>
    apiClient.get(`/auth/profile/view/${profileId}`),

  // GET /api/v1/auth/profile/view/images/:id — profile photos
  getPhotos: (profileId: string) =>
    apiClient.get(`/auth/profile/view/images/${profileId}`),

  // PUT /api/v1/auth/profile/view — record profile view
  recordView: (profileId: string) =>
    apiClient.put('/auth/profile/view', { profileId }),

  // GET /api/v1/auth/profile/show-shortlisted — my shortlist
  getShortlists: () => apiClient.get('/auth/profile/show-shortlisted'),

  // GET /api/v1/auth/profile/viewed — profiles I viewed
  getViewed: () => apiClient.get('/auth/profile/viewed'),

  // GET /api/v1/auth/profile/visited — profiles who visited me
  getVisitors: () => apiClient.get('/auth/profile/visited'),

  // PUT /api/v1/auth/profile/shortlist — add to shortlist
  addShortlist: (profileId: string) =>
    apiClient.put('/auth/profile/shortlist', { profileId }),

  // PUT /api/v1/auth/profile/shortlisted/delete — remove from shortlist
  removeShortlist: (profileId: string) =>
    apiClient.put('/auth/profile/shortlisted/delete', { profileId }),

  // PUT /api/v1/auth/profile/shortlisted/edit — toggle bookmark
  toggleBookmark: (profileId: string) =>
    apiClient.put('/auth/profile/shortlisted/edit', { profileId }),

  // GET /api/v1/auth/profile/clans — distinct clans/gotras
  getClans: () => apiClient.get('/auth/profile/clans'),

  // GET /api/v1/auth/profile/show-blocked — blocked users
  getBlocked: () => apiClient.get('/auth/profile/show-blocked'),

  // PUT /api/v1/auth/profile/block-toggle — block / unblock
  toggleBlock: (profileId: string) =>
    apiClient.put('/auth/profile/block-toggle', { profileId }),
};

export default profileApi;
