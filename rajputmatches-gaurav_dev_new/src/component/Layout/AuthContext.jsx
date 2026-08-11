import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  authApi,
  fetchByRoute,
  updateByRoute,
  getTokenFromResponse,
  isSuccessResponse,
  extractMessage,
  extractData,
} from "../../api";

const AuthContext = createContext();

const DEFAULT_AVATAR =
  "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(DEFAULT_AVATAR);
  const [formData, setFormData] = useState({
    HeightFeetfrom: "",
    HeightFeetto: "",
    gender: "",
    maritalStatus: "",
    maxAge: "",
    minAge: "",
    name: "",
    location: "",
    country: "",
    state: "",
    city: "",
    occupation: "",
    class: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return typeof window !== "undefined" && !!localStorage.getItem("authToken");
    } catch (e) {
      return false;
    }
  });
  const [userData, setUserData] = useState(() => {
    try {
      const cached = localStorage.getItem("user_data_cache");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
  const [loading, setLoading] = useState(false);

  const setToken = (token) => {
    try { localStorage.setItem("authToken", token); } catch (e) {}
  };

  const getToken = () => {
    try { return localStorage.getItem("authToken"); } catch (e) { return null; }
  };

  const removeToken = () => {
    try { localStorage.removeItem("authToken"); } catch (e) {}
  };

  const register = async (_route, data, navigate) => {
    try {
      const response = await authApi.register(data);
      const responseMessage = extractMessage(response);
      const payload = extractData(response) || {};
      const token = getTokenFromResponse(response);

      setMessage(responseMessage);

      if (isSuccessResponse(response)) {
          // NOTE: Do NOT auto-login after registration.
          // User must verify and log in manually.
          // token and user data are intentionally NOT stored here.

          toast.success("Khama Ghani, Hukum! Thank you for registering with Rajput Alliances. We will verify your account and email you once it is approved, so you can log in and create your profile.", {
            position: "top-center",
            autoClose: 6000,
          });

          return { success: true, message: responseMessage };
      }

      toast.error(responseMessage || "Registration failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });

      return { success: false, message: responseMessage };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);

      if (error.response?.status === 404) {
        toast.error("Email is not verified. Redirecting to verification...", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/auth/emailverification");
      } else {
        toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
      }

      return null;
    }
  };

  const login = async (_route, data) => {
    try {
      const response = await authApi.login(data);
      const responseMessage = extractMessage(response);
      const token = getTokenFromResponse(response);

      setMessage(responseMessage);

      if (token) {
        setToken(token);
        setIsAuthenticated(true);
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });
        return { success: true, token };
      } else {
        const errorMsg = responseMessage || "Login failed. Please check your credentials.";
        toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage, { position: "top-center", autoClose: 6000 });
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      removeToken();
      setIsAuthenticated(false);
      setUserData(null);
      toast.success("Logout successful!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const handleAutoLogout = () => {
      removeToken();
      setIsAuthenticated(false);
      setUserData(null);
      toast.error("Session expired. Please log in again.", {
        position: "top-center",
        autoClose: 3000,
      });
    };

    window.addEventListener("unauthorized-logout", handleAutoLogout);
    return () => {
      window.removeEventListener("unauthorized-logout", handleAutoLogout);
    };
  }, []);

  const fetchUserData = React.useCallback(async (route) => {
    try {
      return await fetchByRoute(route);
    } catch (error) {
      console.log("Failed to fetch user data:", error);
      if (error.response?.status === 403) {
        throw error;
      }
      return null;
    }
  }, []);

  /** POST/PUT/PATCH — pass showToast=true only for user-initiated saves/actions */
  const updateData = async (route, data, showToast = false) => {
    try {
      const result = await updateByRoute(route, data);

      if (result?.message && showToast) {
        toast.success(result.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }

      // Trigger sidebar/navbar counts to refresh immediately
      window.dispatchEvent(new Event("profileUpdate"));

      return result;
    } catch (error) {
      if (showToast) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while updating the data.",
          { position: "top-center", autoClose: 3000 }
        );
      }
      return null;
    }
  };

  const fetchprofile = async () => {
    try {
      const avatarData = await fetchUserData("profile");
      const profileUrl = avatarData?.userProfile?.url || profile;
      setProfile(profileUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const user = await fetchUserData("user");
        if (user) {
          setUserData(user);
          try { localStorage.setItem("user_data_cache", JSON.stringify(user)); } catch (e) {}
        }
      })();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        message,
        userData,
        formData,
        profile,
        fetchprofile,
        setUserData,
        setFormData,
        updateData,
        fetchUserData,
        register,
        login,
        logout,
        email,
        setEmail,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
