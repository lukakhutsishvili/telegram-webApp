import axios from "axios";
import { BASE_URL, password, username } from "./Constants";

const encodedCredentials = btoa(`${username}:${password}`);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
  },
});
