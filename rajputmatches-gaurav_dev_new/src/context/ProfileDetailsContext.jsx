import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../component/Layout/AuthContext";

const ProfileDetailsContext = createContext(null);

const SECTION_ROUTES = {
  user: "user",
  horoscope: "get-religiondetails",
  family: "get-family-details",
  professional: "get-professional-data",
  media: "files",
  extendedFamily: "getpaternal-details",
};

export function ProfileDetailsProvider({ children, enabled = true }) {
  const { fetchUserData } = useAuth();
  const { userData: authUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    user: authUserData || null,
    horoscope: null,
    family: null,
    professional: null,
    media: null,
    extendedFamily: null,
  });

  const loadAll = useCallback(
    async (showLoader = false) => {
      if (!enabled) return;

      if (showLoader) {
        setLoading(true);
      }

      try {
        const [user, horoscope, family, professional, media, extendedFamily] =
          await Promise.all([
            // Prefer already-available user data from AuthContext to avoid
            // an extra network roundtrip immediately after registration.
            authUserData ? Promise.resolve(authUserData) : fetchUserData(SECTION_ROUTES.user),
            fetchUserData(SECTION_ROUTES.horoscope),
            fetchUserData(SECTION_ROUTES.family),
            fetchUserData(SECTION_ROUTES.professional),
            fetchUserData(SECTION_ROUTES.media),
            fetchUserData(SECTION_ROUTES.extendedFamily),
          ]);

        setData({
          user,
          horoscope,
          family,
          professional,
          media,
          extendedFamily,
        });
      } finally {
        setLoading(false);
      }
    },
    [enabled, fetchUserData]
  );

  const refreshSection = useCallback(
    async (section) => {
      const route = SECTION_ROUTES[section];
      if (!route) return;

      const sectionData = await fetchUserData(route);
      setData((prev) => ({ ...prev, [section]: sectionData }));
      return sectionData;
    },
    [fetchUserData]
  );

  useEffect(() => {
    if (enabled) {
      loadAll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return (
    <ProfileDetailsContext.Provider
      value={{
        ...data,
        loading,
        refreshSection,
        reloadAll: () => loadAll(false),
      }}
    >
      {children}
    </ProfileDetailsContext.Provider>
  );
}

export function useProfileDetails() {
  const context = useContext(ProfileDetailsContext);
  if (!context) {
    throw new Error("useProfileDetails must be used within ProfileDetailsProvider");
  }
  return context;
}

export function useOptionalProfileDetails() {
  return useContext(ProfileDetailsContext);
}
