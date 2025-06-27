import React, { useContext, useState } from "react";
import { t } from "i18next";
import { Context } from "../App";

interface ReturnDeclineModalProps {
  setReturnDeclineModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReturnReason: string;
  setSelectedReturnReason: React.Dispatch<React.SetStateAction<string>>;
  selectedReturnReasonText: string;
  setSelectedReturnReasonText: React.Dispatch<React.SetStateAction<string>>;
  setReturnOrder: React.Dispatch<React.SetStateAction<string>>;
}

const ReturnDeclineModal: React.FC<ReturnDeclineModalProps> = ({
  setReturnDeclineModalOpen,
  selectedReturnReason,
  setSelectedReturnReason,
  selectedReturnReasonText,
  setSelectedReturnReasonText,
  setReturnOrder,
}) => {
  const [error, setError] = useState<string>("");

  const { reasons } = useContext(Context);

  const handleClose = () => {
    setReturnDeclineModalOpen(false);
    setSelectedReturnReason("");
    setSelectedReturnReasonText("");
    setReturnOrder("");
  };

  const handleconfirm = () => {
    if (!selectedReturnReason) {
      setError(t("You must choose a reason"));
      return;
    } else {
      setReturnDeclineModalOpen(false);
    }
  };
  return (
    <div
      className={`w-full h-full fixed left-1/2 top-0 pt-[90px] transform -translate-x-1/2 bg-black bg-opacity-50 flex items-start justify-center z-50`}
    >
      <div className="bg-white rounded-lg p-6 w-2/3 max-sm:w-3/4">
        <h2 className="text-lg font-bold mb-4 text-center">
          {t("Select Reason")}
        </h2>

        <select
          name="cancellationReason"
          value={selectedReturnReason}
          onChange={(e) => {
            setSelectedReturnReason(e.target.value);
            const selectedReasonObject = reasons.find(
              (reason) => reason.reason_code === e.target.value
            );
            setSelectedReturnReasonText(
              selectedReasonObject?.reason_text || ""
            );
          }}
          className="w-full border p-2 rounded-md"
        >
          <option value="" disabled>
            {t("Choose a reason")}
          </option>
          {reasons?.map((reason) => (
            <option key={reason.reason_code} value={reason.reason_code}>
              {reason.reason_description}
            </option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          <textarea
            value={selectedReturnReasonText}
            onChange={(e) => setSelectedReturnReasonText(e.target.value)}
            placeholder={t("Modify reason text")}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mt-4 flex justify-center space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md"
          >
            {t("Cancel")}
          </button>
          <button onClick={handleconfirm} className={`px-4 py-2 text-black font-semibold rounded-md `}>
            {t("Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnDeclineModal;
