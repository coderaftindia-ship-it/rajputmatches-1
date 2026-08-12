import React, { createContext, useContext, useState, useEffect } from "react";
import { publicApi } from "../api/public.api";
import { BASE_URL } from "../api/client";

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = localStorage.getItem("site_settings_cache");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      companyName: "Rajput Alliances",
      tagline: "Royal Matrimonial",
      logo: "",
      copyrightText: "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved.",
    };
  });

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return "";
    if (typeof logoPath !== "string") return "";
    if (logoPath.startsWith("data:") || logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }
    const cleanPath = logoPath.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${BASE_URL}${formattedPath}`;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Dynamically update browser tab favicon & title
  useEffect(() => {
    if (siteSettings?.logo) {
      try {
        const iconLinks = document.querySelectorAll("link[rel*='icon']");
        if (iconLinks.length > 0) {
          iconLinks.forEach((link) => {
            link.href = siteSettings.logo;
          });
        } else {
          const newFavicon = document.createElement("link");
          newFavicon.rel = "icon";
          newFavicon.href = siteSettings.logo;
          document.head.appendChild(newFavicon);
        }
      } catch (e) {
        console.error("Error updating favicon:", e);
      }
    }
  }, [siteSettings?.logo]);

  const fetchSettings = async () => {
    try {
      if (!publicApi || typeof publicApi.getSiteSettings !== "function") return;
      const res = await publicApi.getSiteSettings();
      if (res?.data?.success && res?.data?.data) {
        const d = res.data.data;
        const newSettings = {
          companyName: d.companyName || "Rajput Alliances",
          tagline: d.tagline || "Royal Matrimonial",
          logo: d.logo ? getLogoUrl(d.logo) : "",
          copyrightText: d.copyrightText || "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved.",
        };
        setSiteSettings(newSettings);
        try {
          localStorage.setItem("site_settings_cache", JSON.stringify(newSettings));
        } catch (e) {}
      }
    } catch (err) {
      // Silent fallback to default site settings
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ siteSettings, fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      siteSettings: {
        companyName: "Rajput Alliances",
        tagline: "Royal Matrimonial",
        logo: "",
        copyrightText: "© 2025-26 Rajput Alliances Matrimony. All Rights Reserved.",
      },
      fetchSettings: () => {},
    };
  }
  return context;
};
