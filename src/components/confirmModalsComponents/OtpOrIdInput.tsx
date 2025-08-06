import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";

interface Props {
  confirmationMethod: string;
  confirmationValue: string;
  setConfirmationValue: (value: string) => void;
  errorMessage: string;
  sendOtp: () => void;
  otpCooldown: number;
  isOtpSending: boolean;
  otpSent: boolean;
  checkOtherClient: () => void;
}

const OtpOrIdInput: React.FC<Props> = ({
  confirmationMethod,
  confirmationValue,
  setConfirmationValue,
  errorMessage,
  sendOtp,
  otpCooldown,
  isOtpSending,
  otpSent,
  checkOtherClient,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* OTP send button */}
      {confirmationMethod === "OTP" && (
        <Button
          onClick={sendOtp}
          className="mb-2 bg-blue-500 text-black text-xs"
          disabled={otpCooldown > 0 || isOtpSending}
        >
          {isOtpSending
            ? t("Sending OTP...")
            : otpCooldown > 0
            ? t("Wait {{otpCooldown}}s", { otpCooldown })
            : t("Send OTP")}
        </Button>
      )}

      {/* OTP sent success message */}
      {otpSent && <div className="text-green-500 mb-2">{t("OTP Sent!")}</div>}

      {/* Always show label */}
      <label className="block font-medium mb-3 text-xs">
        {confirmationMethod === "OTP"
          ? t("Enter OTP Code")
          : confirmationMethod === "Signature"
          ? t("Sign_it")
          : t("Enter ID Number")}
      </label>

      {/* Show input only if not signature */}
      {confirmationMethod !== "Signature" && (
        <>
          <input
            type="text"
            value={confirmationValue}
            onChange={(e) => setConfirmationValue(e.target.value)}
            className="w-full p-2 border-4 rounded text-xs mb-4"
            placeholder={
              confirmationMethod === "OTP" ? t("OTP Code") : t("ID Number")
            }
          />
          {errorMessage && (
            <div className="text-red-500 text-xs mt-1">{errorMessage}</div>
          )}
        </>
      )}

      {/* Other method client check button */}
      {confirmationMethod === "Other" && (
        <Button
          onClick={checkOtherClient}
          className="mb-2 mt-2 text-xs text-black"
        >
          {t("Check Client")}
        </Button>
      )}
    </>
  );
};

export default OtpOrIdInput;
