import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { Auth } from "./Auth";
import { langButtons } from "../Lib/helpers";
import { useLanguage } from "../hooks/useLanguage";

function Register() {
  const { loading, errorKey, showOtpField } = useAuth();
  const { t } = useTranslation();
  const { selectedLanguage, changeLanguage } = useLanguage();

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-yellow-500 p-8 space-y-6">
      <h2 className="text-center text-3xl max-sm:text-base font-extrabold text-black tracking-wide">
        {showOtpField ? t("confirm_otp") : t("register_account")}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-500 border-t-yellow-300"></div>
        </div>
      ) : (
        <Auth />
      )}

      {errorKey && (
        <p className="text-red-600 bg-red-100 p-2 rounded-md text-center text-sm mt-2">
          {t(errorKey)}
        </p>
      )}

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
}

export default Register;
