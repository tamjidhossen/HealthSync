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

  const register = async (userData, userType = "patient") => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Prepare API endpoint based on user type
      const endpoint =
        userType === "patient"
          ? "http://localhost:5000/api/v1/auth/register/patient"
          : "http://localhost:5000/api/v1/auth/register/doctor";

      // In a real app, you would make an actual API call like:
      // const response = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const result = await response.json();

      // Mock successful registration
      const mockUser = {
        id: Date.now(),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: userType,
        // Add user type specific data
        ...(userType === "patient" && {
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          bloodGroup: userData.bloodGroup,
        }),
        ...(userType === "doctor" && {
          licenseNumber: userData.licenseNumber,
        }),
      };

      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setIsAuthenticated(true);
      setUser(mockUser);

      return {
        success: true,
        message: `${
          userType === "patient" ? "Patient" : "Doctor"
        } registration successful!`,
        user: mockUser,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
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
