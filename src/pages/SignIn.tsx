import { useAuth } from "../hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Register from "../components/Register";

interface SignInProps {
  customUserId: string;
  showPopup: boolean;
  setCustomUserId: (id: string) => void;
  setShowPopup: (show: boolean) => void;
}

const SignIn = ({ customUserId, showPopup, setCustomUserId, setShowPopup }: SignInProps) => {
  const { handleSignIn, signInloader } = useAuth();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(Context);
  const [localUserId, setLocalUserId] = useState(customUserId);

  useEffect(() => {
    handleSignIn();
  }, [userInfo, navigate]);

  const handleConfirm = () => {
    if (localUserId.trim() !== "") {
      setUserInfo((prev) => ({ ...prev, telegram_id: localUserId }));
      setCustomUserId(localUserId);
      setShowPopup(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      {signInloader ? <Spinner /> : <Register />}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Enter User ID</h2>
            <input
              type="text"
              value={localUserId}
              onChange={(e) => setLocalUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleConfirm}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
