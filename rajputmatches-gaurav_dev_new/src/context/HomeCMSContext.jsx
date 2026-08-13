/**
 * HomeCMSContext
 * Fetches home CMS data ONCE and shares it via context.
 * This eliminates the duplicate API calls from Banner.jsx and MatchMakingSection.jsx
 * which both called publicApi.getHomeCMS() independently.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { publicApi } from "../api/public.api";

const DEFAULT_CMS = {
  // Banner / Hero
  heroBadgeText: "Trusted Since 2009",
  heroTitleLine1: "Where Royalty",
  heroTitleLine2: "Meets Destiny",
  heroDescription:
    "India's premium royal matrimonial service. Discover verified, dignified matches from distinguished families — crafted for unions that honour tradition and celebrate love.",
  heroCTA1Text: "Begin Your Journey",
  heroCTA2Text: "Explore Matches",
  heroFooterNote: "Free registration • No hidden charges",
  stat1Value: "100%", stat1Label: "Verified",
  stat2Value: "25,000+", stat2Label: "Members",
  stat3Value: "4.9", stat3Label: "Rating",
  stat4Value: "All", stat4Label: "Communities",
  bannerBgImage: "",

  // Matchmaking section
  matchBadgeText: "Heritage & Rajput Legacy Matrimony",
  matchHeading: "Connecting Rajput Families with Trust Tradition & Lasting bonds",
  matchDescription:
    "Step into an exclusive, highly-trusted network designed for noble families. Here, every single profile is strictly verified, connections are deeply meaningful, and matches carry the potential for a lasting royal legacy.",
  matchBullet1Title: "Strict Verification",
  matchBullet1Desc: "100% ID & family check",
  matchBullet2Title: "Royal Custom Filters",
  matchBullet2Desc: "Match by heritage & values",
  matchCTAText: "Find Your Royal Match",
  matchmakingImage: "",
};

const HomeCMSContext = createContext({ cms: DEFAULT_CMS, isLoaded: false });

export const HomeCMSProvider = ({ children }) => {
  const [cms, setCms] = useState(DEFAULT_CMS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    publicApi.getHomeCMS()
      .then((res) => {
        if (res?.data?.data) {
          setCms((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  return (
    <HomeCMSContext.Provider value={{ cms, isLoaded }}>
      {children}
    </HomeCMSContext.Provider>
  );
};

export const useHomeCMS = () => useContext(HomeCMSContext);
