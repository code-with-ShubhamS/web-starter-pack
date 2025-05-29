import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("checkAuth called");
      try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true
        });
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for Google OAuth popup message
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "google-auth-success") {
        console.log("Google OAuth succeeded!");
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const sendOtp = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
      return response.data.success;
    } catch (error) {
      console.error("Send OTP failed:", error);
      return false;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      if (response.data.success) {
        login(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Verify OTP failed:", error);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    console.log("login with Google");
    try {
      window.open(`${API_URL}/auth/google`, "_blank", "width=500,height=600");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        sendOtp,
        verifyOtp,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
/* eslint-enable react-refresh/only-export-components */