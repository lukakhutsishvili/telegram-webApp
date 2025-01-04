// BOT AUTH
export const username = import.meta.env.VITE_BOT_USERNAME;
export const password = import.meta.env.VITE_BOT_PASSWORD;

// BASE URL
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// URLs
export const BOT_AUTH = "/bot/auth";
export const CHECK_OTP = "/bot/check_otp";
export const SEND_OTP = "/bot/register_bot";
export const GET_REASONS = "/pocket/getreasons";
export const ORDER_LIST = "/bot/gettask";
export const GET_DETAILS_BY_SCANNER = "/pocket/getDetailsByTrackCode";
export const changeStatusesOfOrder = "/pocket/changetaskstatus";
export const AMOUNT = "/pocket/cashregistry";
export const SEND_CLIENT_OTP = "/bot/send_client_otp";
export const VERIFY_CLIENT_OTP_URL = "/bot/verify_client_otp";
