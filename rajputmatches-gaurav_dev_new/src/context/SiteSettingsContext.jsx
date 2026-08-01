import React, { createContext, useContext, useState, useEffect } from "react";
import { publicApi } from "../api/public.api";
import { BASE_URL } from "../api";

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    companyName: "Rajput Matches",
    tagline: "Royal Matrimonial",
    logo: "",
    copyrightText: "© 2025-26 Rajput Matches Matrimony. All Rights Reserved.",
  });

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return "";
    if (logoPath.startsWith("http") || logoPath.startsWith("data:")) return logoPath;
    return `${BASE_URL}${logoPath}`;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await publicApi.getSiteSettings();
      if (res.data && res.data.success && res.data.data) {
        const d = res.data.data;
        setSiteSettings({
          companyName: d.companyName || "Rajput Matches",
          tagline: d.tagline || "Royal Matrimonial",
          logo: d.logo ? getLogoUrl(d.logo) : "",
          copyrightText: d.copyrightText || "© 2025-26 Rajput Matches Matrimony. All Rights Reserved.",
        });
      }
    } catch (err) {
      console.error("Error fetching site settings:", err);
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
        companyName: "Rajput Matches",
        tagline: "Royal Matrimonial",
        logo: "",
        copyrightText: "© 2025-26 Rajput Matches Matrimony. All Rights Reserved.",
      },
      fetchSettings: () => {},
    };
  }
  return context;
};
