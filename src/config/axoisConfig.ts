import axios from "axios";
import { env } from "./envConfig";

console.log(env.API_URL);

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    "content-Type": "application/json;",
  },
  withCredentials: true,
});

export default api;
