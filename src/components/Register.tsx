import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { Auth } from "./Auth";
import { langButtons } from "../Lib/helpers";
import { useLanguage } from "../hooks/useLanguage";

function Register() {
  const { loading, errorKey, showOtpField } = useAuth();
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

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
            <img
              src={button.flag}
              className="w-12 h-12 cursor-pointer"
              key={button.lang}
              onClick={() => changeLanguage(button.lang)}
              />
          ))}
      </div>
    </div>
  );
}

export default Register;
