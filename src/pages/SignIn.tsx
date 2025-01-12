import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP, SEND_OTP } from "../api/Constants";
import { Context } from "../App";
import { useTranslation } from "react-i18next";
import { langButtons } from "../Lib/helpers";

const SignIn = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserInfo, userInfo } = useContext(Context);
  const params = { telegram_id: userInfo.telegram_id || "6087086146" };
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem("selectedLanguage", lng);
  };

  const handleSignIn = async () => {
    setLoading(true);
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
      setErrorKey("no_account_register");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    changeLanguage(savedLanguage);
  }, []);

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setErrorKey("phone_number_required");
      return;
    }
    setLoading(true);
    const authData = {
      telegram_id: userInfo.telegram_id,
      phone_number: phoneNumber,
      type: "1",
    };

    try {
      await axiosInstance.post(SEND_OTP, authData);
      setErrorKey("");
      setShowOtpField(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setErrorKey("error_sending_otp");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp.trim()) {
      setErrorKey("otp_required");
      return;
    }
    setLoading(true);
    const data = {
      phone_number: phoneNumber,
      otp,
      telegram_id: userInfo.telegram_id?.toString(),
    };

    try {
      const response = await axiosInstance.get(CHECK_OTP, { params: data });
      setUserInfo((prev: any) => ({
        ...prev,
        name: response.data.response.courier_name,
        device_id: response.data.response.device_id,
      }));
      navigate("/home");
    } catch (err) {
      console.error("Error confirming OTP:", err);
      setErrorKey("error_confirming_otp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-yellow-500 p-8 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-black tracking-wide">
          {showRegister
            ? showOtpField
              ? t("confirm_otp")
              : t("register_account")
            : t("sign_in")}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-500 border-t-yellow-300"></div>
          </div>
        ) : (
          <>
            {!showRegister && (
              <button
                onClick={handleSignIn}
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200"
              >
                {t("sign_in_button")}
              </button>
            )}
            {errorKey && (
              <p className="text-red-600 bg-red-100 p-2 rounded-md text-center text-sm mt-2">
                {t(errorKey)}
              </p>
            )}
            {showRegister && !showOtpField && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                />
                <button
                  onClick={handleRegister}
                  className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200"
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
                  className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                />
                <button
                  onClick={handleConfirmOtp}
                  className="w-full py-2 px-4 bg-gradient-to-r from-black to-gray-800 text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200"
                >
                  {t("confirm_otp_button")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {langButtons.map((button) => (
          <button
            key={button.lang}
            onClick={() => changeLanguage(button.lang)}
            className={`px-4 py-2 rounded-full font-semibold border-2 ${
              selectedLanguage === button.lang
                ? "bg-yellow-500 text-black border-yellow-600 shadow-md"
                : "bg-white text-black border-gray-300 hover:bg-yellow-100 hover:border-yellow-500"
            } transition duration-300 ease-in-out transform hover:scale-105`}
          >
            {button.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignIn;
