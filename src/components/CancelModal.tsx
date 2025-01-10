import { useContext, useState } from "react";
import { Context } from "../App";
import { t } from "i18next";
import { axiosInstance } from "../api/apiClient";
import { DELIVERY_ORDERS, ORDER_LIST, PICKUP_ORDERS } from "../api/Constants";

interface CancelModalProps {
  closeCancellationModal: () => void;
  order: any;
  sendingOrder: any;
}

function CancelModal({
  closeCancellationModal,
  order,
  sendingOrder,
}: CancelModalProps) {
  const { reasons, userInfo, navbarButtons, setSendingTasks, setRecieptTasks } =
    useContext(Context);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedReasonText, setSelectedReasonText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchUpdatedOrderList = async () => {
    try {
      const tasklistData = {
        device_id: userInfo.device_id,
        pickup_task: navbarButtons !== "sending",
        status: ["Waiting", "Accepted", "Completed", "Canceled"],
      };
      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(JSON.stringify(tasklistData)),
        },
      });
      if (navbarButtons == "sending") {
        setSendingTasks(response.data.response);
      } else {
        setRecieptTasks(response.data.response);
      }
      console.log("Order list updated successfully:", response);
    } catch (error) {
      console.error("Failed to fetch order list:", error);
    }
  };

  const confirmCancellation = async () => {
    if (!selectedReason) {
      setError(t("You must choose a reason"));
      return;
    }
    setError(""); 

    const params = {
      device_id: userInfo.device_id,
      payment_type: "cash",
      orders: [
        {
          tracking_code: order.tracking_code,
          successfully: "False",
          reason_id: selectedReason,
          reason_commentary: selectedReasonText,
        },
      ],
    };

    try {
      await axiosInstance.post(
        sendingOrder ? DELIVERY_ORDERS : PICKUP_ORDERS,
        params
      );
      closeCancellationModal();
      await fetchUpdatedOrderList();
      window.history.back();
    } catch (error) {
      console.error("Failed to cancel the order:", error);
    }
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

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
