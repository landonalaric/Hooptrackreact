import { createContext, useContext, useState, useCallback } from "react";
import client, { endpoints, extractError } from "../api/client";

const AuthContext = createContext(null);

export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  COACH: "COACH",
  GUARDIAN: "GUARDIAN",
  SCOUT: "SCOUT",
};

function readStoredUser() {
  try {
    const raw = localStorage.getItem("academy_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());
  const [token, setToken] = useState(localStorage.getItem("academy_token"));

  const login = useCallback(async ({ username, password, coach_id, player_code }) => {
    const payload = { username, password };
    if (coach_id) payload.coach_id = coach_id;
    if (player_code) payload.player_code = player_code;

    try {
      const res = await client.post(endpoints.login, payload);
      const { access: authToken, user_id, role, username: uname, academy } = res.data;
      const userObj = { id: user_id, role, username: uname, academy };
      localStorage.setItem("academy_token", authToken);
      localStorage.setItem("academy_user", JSON.stringify(userObj));
      setToken(authToken);
      setUser(userObj);
      return userObj;
    } catch (err) {
      throw new Error(extractError(err));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("academy_token");
    localStorage.removeItem("academy_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
