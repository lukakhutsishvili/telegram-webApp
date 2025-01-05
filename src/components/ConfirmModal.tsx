import { useContext, useState, useEffect } from "react";
import Button from "../components/Button";
import { SEND_CLIENT_OTP, SET_CLIENT_ID_URL, VERIFY_CLIENT_OTP_URL } from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import { t } from "i18next";

interface ConfirmModalProps {
  closeModal: () => void;
  handleConfirm: (
    paymentMethod: string,
    confirmationMethod: string,
    confirmationValue: string
  ) => void;
  order: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ closeModal, order, handleConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [confirmationMethod, setConfirmationMethod] = useState("OTP");
  const [confirmationValue, setConfirmationValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0); // Cooldown timer for OTP
  const [confirmationMessage, setConfirmationMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(10); 
  const [startTimer, setStartTimer] = useState(false); 
  const { userInfo } = useContext(Context);

  useEffect(() => {
    if (startTimer) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(countdown);
        closeModal();
        window.history.back();
      }

      return () => clearInterval(countdown);
    }
  }, [timer, startTimer, closeModal]);

  // Countdown for OTP cooldown
  useEffect(() => {
    if (otpCooldown > 0) {
      const interval = setInterval(() => {
        setOtpCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpCooldown]);

  const handleConfirmationMethodChange = (method: string) => {
    setConfirmationMethod(method);
    setConfirmationValue(""); 
    setOtpSent(false); 
    setOtpCooldown(0); 
    setConfirmationMessage(""); 
    setErrorMessage("");
  };

  const sendOtp = async () => {
    if (!order.client_phone) {
      alert(t("Phone number is not available."));
      return;
    }

    try {
      setIsOtpSending(true);
      const response = await axiosInstance.post(SEND_CLIENT_OTP, {
        device_id: userInfo.device_id,
        tracking_code: order.tracking_code,
      });
      if (response.status === 200) {
        setOtpSent(true);
        setOtpCooldown(30); 
      } else {
        alert(response.data.message || t("Failed to send OTP."));
      }
    } catch (error) {
      alert(t("Error sending OTP."));
    } finally {
      setIsOtpSending(false);
    }
  };

  const checkClientOtp = async () => {
    if (!confirmationValue) {
      setErrorMessage(t("Please enter the OTP."));
      return;
    }

    const data = {
      device_id: userInfo.device_id,
      tracking_code: order.tracking_code,
      otp: confirmationValue,
    };

    try {
      const response = await axiosInstance.post(VERIFY_CLIENT_OTP_URL, data);

      if (response.status === 200) {
        setConfirmationMessage(t("OTP confirmed!"));
        handleConfirm(paymentMethod, confirmationMethod, confirmationValue);
        setErrorMessage("");
        setStartTimer(true); 
      } else {
        setErrorMessage(response.data.message || t("Invalid OTP. Please try again."));
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || t("Invalid OTP. Please try again."));
    }
  };

  const postClientID = async () => {
    if (!confirmationValue.trim()) {
      setErrorMessage(t("Please enter the ID number."));
      return;
    }

    const idData = {
      device_id: userInfo.device_id,
      tracking_code: order.tracking_code,
      client_id: confirmationValue,
    };

    try {
      const response = await axiosInstance.post(SET_CLIENT_ID_URL, idData);

      if (response.status === 200) {
        setConfirmationMessage(t("ID Number confirmed!"));
        handleConfirm(paymentMethod, confirmationMethod, confirmationValue);
        setErrorMessage("");
        setStartTimer(true); 
      } else {
        setErrorMessage(response.data.message || t("Failed to save ID Number. Please try again."));
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || t("An error occurred while saving the ID Number. Please try again.")
      );
    }
  };

  const onConfirm = async () => {
    if (confirmationMethod === "OTP") {
      await checkClientOtp();
    } else if (confirmationMethod === "ID Number") {
      if (order.client_id) {
        if (order.client_id === confirmationValue) {
          setConfirmationMessage(t("ID Number confirmed!"));
          handleConfirm(paymentMethod, confirmationMethod, confirmationValue);
          setStartTimer(true);
        } else {
          setErrorMessage(t("The ID Number does not match the client's ID. Please try again."));
        }
      } else {
        await postClientID();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">{t("Confirm Handover")}</h2>

        {confirmationMessage ? (
          <div>
            <p className="text-green-500 text-center mb-4">{confirmationMessage}</p>
            <p className="text-sm text-gray-500 text-center">{t("This modal will close in {{timer}} seconds.", { timer })}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-2">{t("Payment Method")}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Cash">{t("Cash")}</option>
                <option value="Bank">{t("Bank")}</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">{t("Confirmation Method")}</label>
              <select
                value={confirmationMethod}
                onChange={(e) => handleConfirmationMethodChange(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="OTP">{t("OTP")}</option>
                <option value="ID Number">{t("ID Number")}</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">
                {confirmationMethod === "OTP" ? t("Enter OTP Code") : t("Enter ID Number")}
              </label>
              {confirmationMethod === "OTP" && (
                <Button
                  onClick={sendOtp}
                  className="mb-2 bg-blue-500 text-white"
                  disabled={otpCooldown > 0 || isOtpSending}
                >
                  {isOtpSending ? t("Sending OTP...") : otpCooldown > 0 ? t("Wait {{otpCooldown}}s", { otpCooldown }) : t("Send OTP")}
                </Button>
              )}
              {otpSent && <div className="text-green-500">{t("OTP Sent!")}</div>}
              <input
                type="text"
                value={confirmationValue}
                onChange={(e) => setConfirmationValue(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={confirmationMethod === "OTP" ? t("OTP Code") : t("ID Number")}
              />
              {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            </div>
          </>
        )}

        <div className="flex justify-center space-x-4">
          <Button onClick={closeModal} className="bg-gray-300 text-black">
            {t("cancel")}
          </Button>
          {!confirmationMessage && (
            <Button onClick={onConfirm} className="bg-yellow-400 text-black">
              {t("confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
