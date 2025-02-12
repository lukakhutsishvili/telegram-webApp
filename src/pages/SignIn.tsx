import { useTranslation } from "react-i18next";
import { langButtons } from "../Lib/helpers";
import useLanguage from "../hooks/useLanguage"; // Import the custom hook
import useAuth from "../hooks/useAuth"; // Import the useAuth hook

const SignIn = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    showRegister,
    showOtpField,
    errorKey,
    loading,
    handleSignIn,
    handleRegister,
    handleConfirmOtp,
  } = useAuth(); // Using the hook

  const { t } = useTranslation();
  const { selectedLanguage, changeLanguage } = useLanguage(); // Use the custom hook

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-yellow-500 p-8 space-y-6">
        <h2 className="text-center text-3xl max-sm:text-base font-extrabold text-black tracking-wide">
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
                  placeholder={t("enter_phone")}
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

      <div className="flex justify-center flex-wrap gap-4 mt-6">
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
