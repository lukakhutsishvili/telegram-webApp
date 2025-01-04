import { useContext, useState } from "react";
import Button from "../components/Button";
import { SEND_CLIENT_OTP, VERIFY_CLIENT_OTP_URL } from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";

interface ConfirmModalProps {
  closeModal: () => void;
  handleConfirm: (
    paymentMethod: string,
    confirmationMethod: string,
    confirmationValue: string
  ) => void;
  order: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  closeModal,
  // handleConfirm,
  order,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [confirmationMethod, setConfirmationMethod] = useState("OTP");
  const [confirmationValue, setConfirmationValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { userInfo } = useContext(Context);

  const sendOtp = async () => {
    if (!order.client_phone) {
      alert("Phone number is not available.");
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
      } else {
        alert(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      alert("Error sending OTP.");
    } finally {
      setIsOtpSending(false);
    }
  };

  const checkClientOtp = async () => {
    if (!confirmationValue) {
      alert("Please enter the OTP.");
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
        console.log("OTP validated successfully!");
        setOtpValid(true);
        setErrorMessage("");
        alert("OTP validated. Proceeding with delivery...");
        closeModal();
      } else {
        setOtpValid(false);
        setErrorMessage(
          response.data.message || "Invalid OTP. Please try again."
        );
      }
    } catch (error: any) {
      setOtpValid(false);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  console.log(otpValid);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Handover</h2>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </div>

        {/* Confirmation Method */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Confirmation Method</label>
          <select
            value={confirmationMethod}
            onChange={(e) => setConfirmationMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="OTP">OTP</option>
            <option value="ID Number">ID Number</option>
          </select>
        </div>

        {/* Confirmation Value */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            {confirmationMethod === "OTP"
              ? "Enter OTP Code"
              : "Enter ID Number"}
          </label>
          {confirmationMethod === "OTP" && (
            <Button onClick={sendOtp} className="mb-2 bg-blue-500 text-white">
              {isOtpSending ? "Sending OTP..." : "Send OTP"}
            </Button>
          )}

          {otpSent && <div className="text-green-500">OTP Sent!</div>}

          <input
            type="text"
            value={confirmationValue}
            onChange={(e) => setConfirmationValue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={
              confirmationMethod === "OTP" ? "OTP Code" : "ID Number"
            }
          />
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={closeModal} className="bg-gray-300 text-black">
            Cancel
          </Button>
          <Button onClick={checkClientOtp} className="bg-yellow-400 text-black">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
