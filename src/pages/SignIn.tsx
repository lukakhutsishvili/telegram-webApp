import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP, SEND_OTP } from "../api/Constants";
import { Context } from "../App";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const { setUserInfo, userInfo } = useContext(Context);
  const chat_id = userInfo.telegram_id || "6087086146";
  const params = { telegram_id: chat_id };
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem("selectedLanguage", lng);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    changeLanguage(savedLanguage);
  }, []);

  // sign in
  const handleSignIn = async () => {
    try {
      const response = await axiosInstance.get(BOT_AUTH, { params });
      setUserInfo((prev: any) => ({
        ...prev,
        name: response.data.response.courier_name,
        device_id: response.data.response.device_id,
      }));
      if (response.status === 200) {
        navigate("/home");
      } else {
        setShowRegister(true);
      }
    } catch (error: any) {
      setShowRegister(true);
      setError(t("no_account_register"));
    }
  };

  // send OTP code
  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setError(t("phone_number_required"));
      return;
    }

    const authData = {
      telegram_id: chat_id,
      phone_number: phoneNumber,
      type: "1",
    };

    try {
      await axiosInstance.post(SEND_OTP, authData);
      if (true) {
        console.log("OTP sent successfully!");
        setError("");
        setShowOtpField(true); // Show the OTP field
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(t("error_sending_otp"));
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp.trim()) {
      setError(t("otp_required"));
      return;
    }

    const data = {
      phone_number: phoneNumber,
      otp,
      telegram_id: chat_id?.toString(),
    };

    try {
      const response = await axiosInstance.get(CHECK_OTP, { params: data });
      setUserInfo((prev: any) => ({
        ...prev,
        name: response.data.response.courier_name,
        device_id: response.data.response.device_id,
      }));
      if (true) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error confirming OTP:", err);
      setError(t("error_confirming_otp"));
    }
  };

  console.log("signIN");

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {showRegister
              ? showOtpField
                ? t("confirm_otp")
                : t("register_account")
              : t("sign_in")}
          </h2>
        </div>

        {!showRegister && (
          <button
            onClick={handleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("sign_in_button")}
          </button>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {showRegister && !showOtpField && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            <button
              onClick={handleRegister}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {t("send_otp")}
            </button>
          </div>
        )}
        {showOtpField && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t("enter_otp")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            <button
              onClick={handleConfirmOtp}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("confirm_otp_button")}
            </button>
          </div>
        )}
      </div>

      {/* Language Switcher */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => changeLanguage("ge")}
          className={`px-3 py-1 border-black border rounded ${
            selectedLanguage === "ge" ? "bg-yellow-600" : "bg-yellow-400"
          }`}
        >
          ქართული
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`px-3 py-1 border-black border rounded ${
            selectedLanguage === "en" ? "bg-yellow-600" : "bg-yellow-400"
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("ru")}
          className={`px-3 py-1 border-black border rounded ${
            selectedLanguage === "ru" ? "bg-yellow-600" : "bg-yellow-400"
          }`}
        >
          Русский
        </button>
      </div>
    </div>
  );
};

export default SignIn;
