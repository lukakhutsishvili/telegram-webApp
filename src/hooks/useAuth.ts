import { useState, useContext } from "react";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP, SEND_OTP } from "../api/Constants";
import { Context } from "../App";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const params = { telegram_id: userInfo.telegram_id  };
  const [signInloader, setSignInloader] = useState(true);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(BOT_AUTH, { params });

      if (response.status === 200) {
        setUserInfo((prev: any) => ({
          ...prev,
          name: response.data.response.courier_name,
          device_id: response.data.response.device_id,
        }));
        navigate("/home");
      } else {
        setShowRegister(true);
      }
    } catch (error: any) {
      setSignInloader(false);
      setShowRegister(true);
      setErrorKey("no_account_register");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (phoneNumber: string) => {
    if (!phoneNumber.trim()) {
      setErrorKey("phone_number_required");
      return;
    }
    setLoading(true);

    const authData = {
      telegram_id: userInfo.telegram_id || "",
      phone_number: phoneNumber,
      type: "1",
    };

    try {
      await axiosInstance.post(SEND_OTP, authData);

      setErrorKey("");
      setShowOtpField(true);
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setErrorKey("error_sending_otp");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (phoneNumber: string, otp: string) => {
    if (!otp.trim()) {
      setErrorKey("otp_required");
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.get(CHECK_OTP, {
        params: {
          phone_number: phoneNumber,
          otp,
          telegram_id: userInfo.telegram_id?.toString() || "6087086146",
        },
      });

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
  return {
    handleSignIn,
    handleRegister,
    handleConfirmOtp,
    loading,
    errorKey,
    showRegister,
    showOtpField,
    signInloader,
  };
};
