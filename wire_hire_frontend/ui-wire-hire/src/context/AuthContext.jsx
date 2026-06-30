import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialization of user authorization useStates
  //user object
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  //user token
  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token") || null;
  });

  // user role
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const login = (userData, userToken, userRole) => {
    setUser(userData);
    setToken(userToken);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", userToken);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser(null);
      setToken(null);
      setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);