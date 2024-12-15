import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { BOT_AUTH, CHECK_OTP } from "../api/Constants";
import { Context } from "../App";

const SignIn = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const chat_id = '';
  const params = { telegram_id: chat_id };
  const { setUserInfo } = useContext(Context);

  // sign in
  const handleSignIn = async () => {
    try {
      const response = await axiosInstance.get(BOT_AUTH, { params });
      console.log(response);
      setUserInfo((prev: any) => ({
        ...prev,
        name: response.data.response.courier_name,
      }));

      if (response.status === 200) {
        navigate("/home");
      } else {
        setShowRegister(true);
      }
    } catch (error: any) {
      setShowRegister(true);
      setError("You don't have an account. Please register.");
    }
  };

  // send OTP code
  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }

    const authData = {
      telegram_id: chat_id,
      phone_number: phoneNumber,
      type: "1",
    };

    try {
      const response = await axiosInstance.post("/bot/register_bot", authData);
      if (response.data.status === true) {
        console.log("OTP sent successfully!");
        setError("");
        setShowOtpField(true); // Show the OTP field
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An error occurred while sending OTP.");
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required.");
      return;
    }

    const data = {
      phone_number: phoneNumber,
      otp,
      telegram_id: chat_id,
    };

    console.log(data);

    try {
      const response = await axiosInstance.get(CHECK_OTP, { data });
      console.log(response.data);

      if (true) {
        console.log("OTP confirmed successfully!");
        navigate("/home");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error confirming OTP:", err);
      setError("An error occurred while confirming OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {showRegister
              ? showOtpField
                ? "Confirm OTP"
                : "Register your account"
              : "Sign in to your account"}
          </h2>
        </div>

        {!showRegister && (
          <button
            onClick={handleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
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
              Send OTP
            </button>
          </div>
        )}
        {showOtpField && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            <button
              onClick={handleConfirmOtp}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirm OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
