import axios from "axios";

// Point this at your Django backend (e.g. http://localhost:8000)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("academy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("academy_token");
      localStorage.removeItem("academy_user");
    }
    return Promise.reject(err);
  }
);

// Pull the first readable message out of a DRF error response
export function extractError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.error) return data.error;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    const msg = Array.isArray(val) ? val[0] : val;
    return typeof msg === "string" ? msg : "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export const endpoints = {
  login: "/api/accounts/login/",
  registerAcademy: "/api/accounts/superadmin/register-academy/",
  createUser: "/api/accounts/admin/create-user/",
  scoutSignup: "/api/accounts/scout/signup/",

  academies: "/api/academies/",
  teams: "/api/teams/",
  players: "/api/players/",
  attendance: "/api/attendance/",
  fitness: "/api/fitness/",
  schedules: "/api/schedules/",
  scoutReports: "/api/scout-reports/",
  announcements: "/api/announcements/",
  fees: "/api/fees/",
  payments: "/api/payments/",
  chat: "/api/chat/",
};

export default client;
