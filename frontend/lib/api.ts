import axios, { AxiosError } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================
   REQUEST INTERCEPTOR
====================== */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ======================
   RESPONSE INTERCEPTOR
====================== */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // localStorage.removeItem("token");

        // // safer than location.href
        // window.dispatchEvent(new Event("auth:logout"));
        console.log("error : ",error.message);
      }
    }

    return Promise.reject(
      error.response?.data?.message ?? "Something went wrong"
    );
  }
);
