import axios from "axios";

const token = import.meta.env.VITE_TMDB_TOKEN;

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  params: { language: "ko-KR" },
});

export const imageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

export const backdropUrl = (path) => imageUrl(path, "original");

export const tokenIsConfigured = Boolean(token && token !== "TMDB_READ_ACCESS_TOKEN");

export async function getList(path, params = {}) {
  const { data } = await tmdb.get(path, { params });
  return data;
}
