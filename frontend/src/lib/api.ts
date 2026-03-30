// src/lib/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await axios.post(`${BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Auth helpers
export const authApi = {
  register: (body: { email: string; password: string; displayName: string; role?: string }) =>
    api.post("/auth/register", body),
  login: (body: { email: string; password: string }) =>
    api.post("/auth/login", body),
  logout: () => {
    const refreshToken = localStorage.getItem("refreshToken");
    return api.post("/auth/logout", { refreshToken });
  },
};

// Track helpers
export const tracksApi = {
  list: (params?: { genre?: string; q?: string; limit?: number; offset?: number }) =>
    api.get("/tracks", { params }),
  get: (id: string) => api.get(`/tracks/${id}`),
  incrementPlay: (id: string) => api.post(`/tracks/${id}/play`),
  byArtist: (artistId: string) => api.get(`/tracks/artist/${artistId}`),
  delete: (id: string) => api.delete(`/tracks/${id}`),
};

// Upload helper
export const uploadApi = {
  track: (formData: FormData) =>
    api.post("/upload/track", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
