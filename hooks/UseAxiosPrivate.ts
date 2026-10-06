import axios from "axios";
import { getToken } from "./token";

const useAxiosPrivate = () => {
  const axiosPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
  });

  // Add token automatically for requests
  axiosPrivate.interceptors.request.use(async (config) => {
    // Get the token from localStorage (set after login)
    const token = await getToken();

    if (!token) {
      console.warn("No auth token found. Requests may fail with 401.");
    }

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Optional secret key header



    if (config.headers) {
      config.headers["X-SECRET-KEY"] = process.env.NEXT_PUBLIC_SECRET_KEY || "";
    }

    return config;
  });

  // Handle responses globally
  axiosPrivate.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Unauthorized! Please login again.");
      
        } else if (error.response.status === 530) {
          console.error("Server unavailable (530). Try again later.");
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosPrivate;
};

export default useAxiosPrivate;
