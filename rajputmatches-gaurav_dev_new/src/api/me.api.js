import { apiClient } from "./client";

export const meApi = {
  getProfile: () => apiClient.get("/me"),

  updateBasic: (fields) => apiClient.patch("/me/basic", { data: fields }),

  getProfessional: () => apiClient.get("/me/professional"),

  updateProfessional: (fields) =>
    apiClient.patch("/me/professional", { data: fields }),

  getHoroscope: () => apiClient.get("/me/horoscope"),

  updateHoroscope: (fields) =>
    apiClient.patch("/me/horoscope", { data: fields }),

  getFamily: () => apiClient.get("/me/family"),

  updateFamily: (fields) => apiClient.patch("/me/family", { data: fields }),

  getExtendedFamily: () => apiClient.get("/me/extended-family"),

  updateExtendedFamily: (fields) =>
    apiClient.patch("/me/extended-family", { data: fields }),
};
