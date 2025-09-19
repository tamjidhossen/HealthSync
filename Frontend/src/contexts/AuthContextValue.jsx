import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        // Check if user is logged in (could be from localStorage, token, etc.)
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - in real app, role would come from API
      const mockUser = {
        id: 1,
        email: credentials.email,
        name: credentials.name || "User",
        role: credentials.role || "patient", // Default to patient if no role specified
      };

      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setIsAuthenticated(true);
      setUser(mockUser);

      return { success: true, message: "Login successful!" };
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration - in real app, role would be determined during registration
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name || "User",
        role: userData.role || "patient", // Default to patient if no role specified
      };

      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setIsAuthenticated(true);
      setUser(mockUser);

      return { success: true, message: "Registration successful!" };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
