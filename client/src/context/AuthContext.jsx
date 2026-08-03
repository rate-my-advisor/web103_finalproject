import { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    fetch(`${API_BASE_URL}/auth/user`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to check auth status:", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const loginGitHub = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  const loginLocal = async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to log in.");
    }
    setUser(data.user);
    return data.user;
  };

  const registerLocal = async (username, password, name) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to register account.");
    }
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to log out on server.");
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginGitHub,
        loginLocal,
        registerLocal,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
