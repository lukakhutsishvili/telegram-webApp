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
export const DELIVERY_ORDERS = "pocket/deliveryorders";
export const PICKUP_ORDERS = "/pocket/pickuporders";
export const SET_CLIENT_ID_URL = "/bot/idvalidation";
export const MODIFY_SORT_NUMBER = "/pocket/modifysortnumbers";
export const CHECK_OTP_CONFIRMATION = "/bot/check_otp_confirmation";
export const CHECK_OTHER_PERSON= "/bot/CheckOrCreateOtherRecipient";
export const GET_RELATIONSHIPS = "/bot/getrelationships";
