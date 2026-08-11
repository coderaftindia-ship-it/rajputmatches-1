import { apiClient } from './apiClient';

export const connectionApi = {
  // GET /api/v1/auth/profile/myrequests  — connection requests received
  list: () => apiClient.get('/auth/profile/myrequests'),

  // PUT /api/v1/auth/profile/request  — send a connection request
  send: (profileId: string) =>
    apiClient.put('/auth/profile/request', { profileId }),

  // PUT /api/v1/auth/profile/withdrawal  — withdraw received request
  withdraw: (profileId: string) =>
    apiClient.put('/auth/profile/withdrawal', { profileId }),

  // PUT /api/v1/auth/profile/accept  — accept a request
  accept: (profileId: string) =>
    apiClient.put('/auth/profile/accept', { profileId }),

  // PUT /api/v1/auth/profile/reject  — reject a request
  reject: (profileId: string) =>
    apiClient.put('/auth/profile/reject', { profileId }),

  // PUT /api/v1/auth/profile/reqsent/withdrawal  — withdraw a sent request
  withdrawSent: (profileId: string) =>
    apiClient.put('/auth/profile/reqsent/withdrawal', { profileId }),

  // PUT /api/v1/auth/profile/reqsent/accept
  acceptSent: (profileId: string) =>
    apiClient.put('/auth/profile/reqsent/accept', { profileId }),

  // PUT /api/v1/auth/profile/reqsent/reject
  rejectSent: (profileId: string) =>
    apiClient.put('/auth/profile/reqsent/reject', { profileId }),

  // GET /api/v1/auth/profile/contactrequests
  listContactRequests: () => apiClient.get('/auth/profile/contactrequests'),

  // PUT /api/v1/auth/profile/contactRequest  — send contact request
  sendContactRequest: (profileId: string) =>
    apiClient.put('/auth/profile/contactRequest', { profileId }),

  // PUT /api/v1/auth/profile/contact/withdrawal
  withdrawContactRequest: (profileId: string) =>
    apiClient.put('/auth/profile/contact/withdrawal', { profileId }),

  // PUT /api/v1/auth/profile/contact/accept
  acceptContactRequest: (profileId: string) =>
    apiClient.put('/auth/profile/contact/accept', { profileId }),

  // PUT /api/v1/auth/profile/contact/reject
  rejectContactRequest: (profileId: string) =>
    apiClient.put('/auth/profile/contact/reject', { profileId }),

  // GET /api/v1/auth/profile/photorequests
  listPhotoRequests: () => apiClient.get('/auth/profile/photorequests'),

  // PUT /api/v1/auth/profile/photoRequest  — send photo access request
  sendPhotoRequest: (profileId: string) =>
    apiClient.put('/auth/profile/photoRequest', { profileId }),
};

export default connectionApi;
