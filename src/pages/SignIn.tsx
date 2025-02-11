
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { langButtons } from "../Lib/helpers";
import { useTranslation } from "react-i18next";
import Auth from "../components/Auth";

const SignIn = () => {
  const {
    handleSignIn,
    loading,
    errorKey,
    showRegister,
    showOtpField,
  } = useAuth();

  const { selectedLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-yellow-500 p-8 space-y-6">
        <h2 className="text-center text-3xl max-sm:text-base font-extrabold text-black tracking-wide">
          {showRegister ? (showOtpField ? t("confirm_otp") : t("register_account")) : t("sign_in")}
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
              <p className="text-red-600 bg-red-100 p-2 rounded-md text-center text-sm mt-2">{t(errorKey)}</p>
            )}

            {showRegister && !showOtpField && (
              <Auth/>
            )}

          </>
        )}
      </div>

      {/* Language Selection */}
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
