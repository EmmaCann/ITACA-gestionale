// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// });

import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "").trim();

export const axiosInstance = axios.create(
  baseURL ? { baseURL } : {}
);
