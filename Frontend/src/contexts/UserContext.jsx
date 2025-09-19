import { createContext, useState, useEffect } from "react";

const UserContext = createContext({
  user: null,
  role: null,
  setUser: () => null,
  setRole: () => null,
});

export { UserContext };

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Load user data from localStorage or API on component mount
    const savedUser = localStorage.getItem("healthsync-user");
    const savedRole = localStorage.getItem("healthsync-role");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("healthsync-user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("healthsync-user");
    }
  };

  const updateRole = (roleData) => {
    setRole(roleData);
    if (roleData) {
      localStorage.setItem("healthsync-role", roleData);
    } else {
      localStorage.removeItem("healthsync-role");
    }
  };

  const value = {
    user,
    role,
    setUser: updateUser,
    setRole: updateRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
