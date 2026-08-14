/**
 * preload.js
 * -------------------------------------------------
 * Import this file FIRST in index.js (before React).
 * It fires all critical public APIs in parallel so
 * their results land in the in-memory + localStorage
 * cache BEFORE any React component mounts.
 *
 * Result: components get instant data on first render
 * — zero loading spinners for site-settings, home-cms,
 * contact-cms, stories-cms, social-links, etc.
 * -------------------------------------------------
 */

import { publicApi } from "./public.api";
import { fetchByRoute } from "./routeAdapter";

const hasAuth = () => {
  try {
    return !!localStorage.getItem("authToken");
  } catch (e) {
    return false;
  }
};

const preloads = [
  publicApi.getSiteSettings(),
  publicApi.getHomeCMS(),
  publicApi.getSocialLinks(),
  publicApi.getStoriesCMS(),
  publicApi.getContactCMS(),
  publicApi.getAbout(),
];

if (hasAuth()) {
  preloads.push(
    fetchByRoute("user"),
    fetchByRoute("profile"),
    fetchByRoute("profile/stories")
  );
}

// ---- Fire all in parallel, silently ----
Promise.allSettled(preloads).catch(() => {});
// Note: we intentionally do NOT await — we just kick off
// the requests so they race ahead while React is still
// parsing & evaluating the rest of the bundle.
