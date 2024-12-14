import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

const SignIn = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const chat_id = 6087086146;
  const params = { telegram_id: chat_id };

  const handleSignIn = async () => {
    try {
      const response = await axiosInstance.get("/bot/auth", { params });
      if (response.status === 200) {
        navigate("/home");
      } else {
        setShowRegister(true);
      }
    } catch (error: any) {
      setShowRegister(true);
      setError("you dont have account. Please register.");
    }
  };

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }

    const authData = {
      telegram_id: chat_id,
      phone_number: "591081124",
      type: "1",
    };

    try {
      const response = await axiosInstance.post("/bot/register_bot", authData);
      console.log(response);

      if (true) {
        console.log("Phone number processed successfully!");
        setError("");
      } else {
        setError("Failed to process phone number. Please try again.");
      }
    } catch (err) {
      console.error("Error processing phone number:", err);
      setError("An error occurred while processing your phone number.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {showRegister ? "Register your account" : "Sign in to your account"}
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
        {showRegister && (
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
      </div>
    </div>
  );
};

export default SignIn;
