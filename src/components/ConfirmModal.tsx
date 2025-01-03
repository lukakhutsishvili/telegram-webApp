import React, { useState } from "react";
import Button from "../components/Button";

interface ConfirmModalProps {
  closeModal: () => void;
  handleConfirm: (paymentMethod: string, confirmationMethod: string, confirmationValue: string) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  closeModal,
  handleConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [confirmationMethod, setConfirmationMethod] = useState("OTP");
  const [confirmationValue, setConfirmationValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = () => {
    // Simulate sending OTP
    console.log("Sending OTP...");
    setOtpSent(true);
  };

  const onConfirm = () => {
    if (!confirmationValue) {
      alert("Please provide the confirmation value.");
      return;
    }
    handleConfirm(paymentMethod, confirmationMethod, confirmationValue);
    closeModal();
  };

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
            {confirmationMethod === "OTP" ? "Enter OTP Code" : "Enter ID Number"}
          </label>
          {confirmationMethod === "OTP"  && (
            <Button onClick={sendOtp} className="mb-2 bg-blue-500 text-white">
              Send OTP
            </Button>
          )}
          
          { otpSent && <h3>Sending OTP...</h3>}

          <input
            type="text"
            value={confirmationValue}
            onChange={(e) => setConfirmationValue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={confirmationMethod === "OTP" ? "OTP Code" : "ID Number"}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={closeModal} className="bg-gray-300 text-black">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-yellow-400 text-black">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

