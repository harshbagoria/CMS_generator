
import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

function getStoredUser() {
  const storedUser = localStorage.getItem("user");
  if (storedUser === null) return null;

  try {
    const user = JSON.parse(storedUser);
    if (user && typeof user === "object" && !Array.isArray(user)) return user;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.warn("Removing invalid saved user data from localStorage.", error);
  }

  localStorage.removeItem("user");
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token && token !== "undefined" && token !== "null");
  });

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
