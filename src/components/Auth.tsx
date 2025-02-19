import { useState } from "react";
import {  getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";


export function Auth() {
  const { t } = useTranslation();
  const { handleRegister, handleConfirmOtp, loading, showOtpField } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");


  useEffect(() => {
    getAuth(); 
  }, []);
  
  
  return (
    <div className="space-y-4">


      {/* Phone Number Input */}
      <input
        type="text"
        placeholder={t("enter_phone_number")}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full px-3 py-2 border border-yellow-500 rounded-md focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
      />
      <button
        onClick={() => handleRegister(phoneNumber)}
        disabled={loading}
        className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200"
      >
        {t("send_otp")}
      </button>

      {/* OTP Input */}
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
            onClick={() => handleConfirmOtp(phoneNumber, otp)}
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-black to-gray-800 text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition duration-200"
          >
            {t("confirm_otp_button")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Auth;
