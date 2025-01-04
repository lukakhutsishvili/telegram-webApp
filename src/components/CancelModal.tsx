import { useContext, useState } from "react";
import { Context } from "../App";
import { t } from "i18next";
import { axiosInstance } from "../api/apiClient";
import { DELIVERY_ORDERS } from "../api/Constants";

interface CancelModalProps {
  closeCancellationModal: () => void;
  handleStatusChange: (status: string) => void;
  order: any;
}

function CancelModal({
  closeCancellationModal,
  handleStatusChange,
  order,
}: CancelModalProps) {
  const { reasons } = useContext(Context);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedReasonText, setSelectedReasonText] = useState<string>("");
  const { userInfo } = useContext(Context);

  const confirmCancellation = async () => {
    const params = {
      device_id: userInfo.device_id,
      payment_type: "cash",
      orders: [
        {
          tracking_code: order.tracking_code,
          successfully: false,
          reason_id: "1",
          reason_commentary: "No one was at the address",
        },
      ],
    };
    const response = await axiosInstance.post(DELIVERY_ORDERS, params);
    console.log(response);
    handleStatusChange("Undelivered");
    closeCancellationModal();
  };
  return (
    <div className="w-full h-full fixed left-1/2 top-0 pt-[90px] transform -translate-x-1/2 bg-black bg-opacity-50 flex items-start justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 max-sm:w-3/4">
        <h2 className="text-lg font-bold mb-4 text-center">
          {t("Select Reason")}
        </h2>

        {/* Cancellation Reason Dropdown */}
        <select
          name="cancellationReason"
          value={selectedReason}
          onChange={(e) => {
            setSelectedReason(e.target.value);
            const selectedReasonObject = reasons.find(
              (reason) => reason.reason_code === e.target.value
            );
            setSelectedReasonText(selectedReasonObject?.reason_text || "");
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

        {/* Input for modifying reason text */}
        <div className="mt-4">
          <textarea
            value={selectedReasonText}
            onChange={(e) => setSelectedReasonText(e.target.value)}
            placeholder={t("Modify reason text")}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mt-4 flex justify-center space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:gap-3">
          <button
            onClick={closeCancellationModal}
            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={confirmCancellation}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
          >
            {t("Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
