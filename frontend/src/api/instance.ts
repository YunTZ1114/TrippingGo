import axios from "axios";

export const baseInstance = axios.create({
  baseURL:
    typeof window === "undefined"
      ? `${process.env.NEXT_PUBLIC_CLIENT_URL}/api`
      : "/api",
  // Enable withCredentials setting on the current pack-mode is production mode
  withCredentials: process.env.NODE_ENV === "production",
});

if (typeof window !== "undefined" && localStorage.getItem("token")) {
  baseInstance.defaults.headers.common["Authorization"] =
    `Bearer ${localStorage.getItem("token")}`;
}
