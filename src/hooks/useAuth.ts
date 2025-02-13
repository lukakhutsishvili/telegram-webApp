import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP, SEND_OTP } from "../api/Constants";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Context } from "../App";

const useAuth = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(Context);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [loading, setLoading] = useState(false);
  const params = { telegram_id: userInfo.telegram_id || "6087086146"};

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(BOT_AUTH, { params });
      setUserInfo((prev) => ({
        ...prev,
        name: response.data.response.courier_name,
        device_id: response.data.response.device_id,
      }));
      if (response.status === 200) {
        navigate("/home");
      } else {
        setShowRegister(true);
      }
    } catch (error) {
      setShowRegister(true);
      setErrorKey("no_account_register");
    } finally {
      setLoading(false);
    }
  };

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
      setUserInfo((prev) => ({
        ...prev,
        name: response.data.response.courier_name,
        device_id: response.data.response.device_id,
      }));
      navigate("/home");
    } catch (err) {
      setErrorKey("error_confirming_otp");
    } finally {
      setLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    showRegister,
    setShowRegister,
    showOtpField,
    setShowOtpField,
    errorKey,
    setErrorKey,
    loading,
    handleSignIn,
    handleRegister,
    handleConfirmOtp,
  };
};

export default useAuth;
