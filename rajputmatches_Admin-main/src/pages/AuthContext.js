import React, { createContext, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  var Base_url = (process.env.REACT_APP_BASE_URL || "http://localhost:5000/admin").replace(/\/$/, "");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storyId, setStoryId] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const setToken = (token) => {
    localStorage.setItem("adminAuthToken", token);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    setIsAuthenticated(true);
  };

  const getToken = () => localStorage.getItem("adminAuthToken");

  const removeToken = () => {
    localStorage.removeItem("adminAuthToken");
    localStorage.setItem("isAuthenticated", JSON.stringify(false));
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = async (route, data) => {
    try {
      console.log(data);
      console.log(Base_url);
      const response = await axios.post(`${Base_url}/${route}`, data);
      const { message, token } = response.data;
      setMessage(message);
      if (token) setToken(token);
      toast.success("Login successful!");
      setRedirectToLogin(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  const register = async (route, data) => {
    try {
      const response = await axios.post(`${Base_url}/${route}`, data);
      const { message, token } = response.data;
      setMessage(message);
      if (token) setToken(token);
      toast.success("Registration successful!");
      setRedirectToLogin(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  const fetchUserData = async (route) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return null;
      const response = await axios.get(`${Base_url}/${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error("Fetch user data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (route, data) => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.put(
        `${Base_url}/${route}`,
        { data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.message) toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the data.";
      toast.error(errorMessage);
      console.error("Update data error:", error);
    }
  };

  const logout = () => {
    removeToken();
    toast.success("Logout successful!");
    setRedirectToLogin(true);
    <Navigate to="login" replace />;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        login,
        logout,
        storyId,
        setStoryId,
        fetchUserData,
        updateData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
