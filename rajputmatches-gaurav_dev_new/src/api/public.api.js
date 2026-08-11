import { apiClient } from "./client";

const cache = new Map();
const pendingPromises = new Map();

const fetchCached = (key, fetcher, ttlMs = 60000) => {
  const now = Date.now();
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (now < expiry) return Promise.resolve(data);
  } else {
    try {
      const local = localStorage.getItem(`api_cache_${key}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (now < parsed.expiry) {
          cache.set(key, parsed);
          // Trigger background update silently
          fetcher().then((res) => {
            cache.set(key, { data: res, expiry: Date.now() + ttlMs });
            try { localStorage.setItem(`api_cache_${key}`, JSON.stringify({ data: res, expiry: Date.now() + ttlMs })); } catch (e) {}
          }).catch(() => {});
          return Promise.resolve(parsed.data);
        }
      }
    } catch (e) {}
  }

  if (pendingPromises.has(key)) {
    return pendingPromises.get(key);
  }

  const promise = fetcher()
    .then((res) => {
      const cacheObj = { data: res, expiry: Date.now() + ttlMs };
      cache.set(key, cacheObj);
      try { localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheObj)); } catch (e) {}
      pendingPromises.delete(key);
      return res;
    })
    .catch((err) => {
      pendingPromises.delete(key);
      throw err;
    });

  pendingPromises.set(key, promise);
  return promise;
};

export const publicApi = {
  submitContact: (formData) =>
    apiClient.post("/public/contact", { data: formData }),

  getPage: (slug) => apiClient.get(`/public/pages/${slug}`),

  getRecentProfiles: () =>
    fetchCached("recentProfiles", () => apiClient.get("/auth/public/recent-profiles"), 30000),

  getAbout: () =>
    fetchCached("about", () => apiClient.get("/auth/about"), 60000),

  getHomeCMS: () =>
    fetchCached("homeCMS", () => apiClient.get("/auth/home-cms"), 60000),

  getContactCMS: () =>
    fetchCached("contactCMS", () => apiClient.get("/auth/contact-cms"), 60000),

  getStoriesCMS: () =>
    fetchCached("storiesCMS", () => apiClient.get("/auth/stories-cms"), 60000),

  getSiteSettings: () =>
    apiClient.get("/auth/site-settings"),

  getSocialLinks: () =>
    fetchCached("socialLinks", () => apiClient.get("/auth/social-links"), 60000),
};
