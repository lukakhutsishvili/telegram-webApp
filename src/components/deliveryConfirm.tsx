import React, { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setAction(null); // Reset action when payment method changes
  };

  const handleActionChange = (selectedAction: string) => {
    setAction(selectedAction);
  };

  if (!isOpen) return null;

  return (
    <div>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-96 z-50 p-6">
        <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>

        {/* Payment Methods */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => handlePaymentMethodChange("bank")}
              className="form-radio"
            />
            <span>Bank</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => handlePaymentMethodChange("cash")}
              className="form-radio"
            />
            <span>Cash</span>
          </label>
        </div>

        {/* Actions */}
        {paymentMethod && (
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Choose Action</h3>
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                name="action"
                value="otp"
                checked={action === "otp"}
                onChange={() => handleActionChange("otp")}
                className="form-radio"
              />
              <span>Send OTP Code</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="action"
                value="idValidation"
                checked={action === "idValidation"}
                onChange={() => handleActionChange("idValidation")}
                className="form-radio"
              />
              <span>ID Validation</span>
            </label>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() =>
              alert(`Payment Method: ${paymentMethod}, Action: ${action}`)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!paymentMethod || !action}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
