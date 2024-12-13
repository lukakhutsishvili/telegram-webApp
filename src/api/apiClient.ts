import axios from "axios";

const username = "telegram_bot";
const password = "657152";
const encodedCredentials = btoa(`${username}:${password}`);

export const axiosInstance = axios.create({
  baseURL: "https://bo.delivo.ge/delivo_test/hs/bot",
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
  },
});
