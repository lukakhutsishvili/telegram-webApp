import { useState, useContext } from "react";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth"; 
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP, SEND_OTP } from "../api/Constants";
import { Context } from "../App";
import { auth } from "../config/firebase";
import axios from "axios";


export const useAuth = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
<<<<<<< Updated upstream
  const params = { telegram_id: userInfo.telegram_id  };
=======
  const params = { telegram_id: userInfo.telegram_id || "1800276631" };
>>>>>>> Stashed changes

  const user = auth.currentUser;


  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(BOT_AUTH, { params });

      if(user !== null && response.status === 200) {
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
<<<<<<< Updated upstream
      telegram_id: userInfo.telegram_id ,
=======
      telegram_id: userInfo.telegram_id || "",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          telegram_id: userInfo.telegram_id?.toString(),
=======
          telegram_id: userInfo.telegram_id?.toString() || "1800276631",
>>>>>>> Stashed changes
        },
      });

      console.log("Response:", response.data);
  
      if (response.data.status) {

        const getFirebaseToken = async () => {
          const firebaseToken = response.data.response.device_id;
          try {
            const fireBaseResponse  = await axios.post("http://localhost:5000/generate-token", {
              telegram_id: firebaseToken,
            });
            return fireBaseResponse.data.firebase_token;
          } catch (error) {
            console.error("Error generating token:", error);
            throw error;
          }
        };

        const newToken = await getFirebaseToken();
        console.log(auth, newToken);
        await signInWithCustomToken(auth, newToken); 
            
  
        setUserInfo((prev: any) => ({
          ...prev,
          name: response.data.response.courier_name,
          device_id: response.data.response.device_id,
        }));
  
        navigate("/home");
      } else {
        setErrorKey("error_confirming_otp_telegram");
      }
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
  };
};
