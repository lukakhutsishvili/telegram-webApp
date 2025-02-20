import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export function Auth() {
  const { t } = useTranslation();
  const { handleRegister, handleConfirmOtp, loading, showOtpField } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");



  return (
    <div className="space-y-4">
      {/* Phone Number Input */}
      {!showOtpField && (
        <>
          <input
            type="text"
            placeholder={t("enter_phone_number")}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
            aria-label="Phone Number"
          />
          <button
            onClick={() => handleRegister(phoneNumber)}
            disabled={loading}
            className={`w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {t("send_otp")}
          </button>
        </>
      )}

      {/* OTP Input */}
      {showOtpField && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t("enter_otp")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
            aria-label="OTP"
          />
          <button
            onClick={() => handleConfirmOtp(phoneNumber, otp)}
            disabled={loading}
            className={`w-full py-2 px-4 bg-gradient-to-r from-black to-gray-800 text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {t("confirm_otp_button")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Auth;
