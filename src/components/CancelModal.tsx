import { useContext, useState } from "react";
import { Context } from "../App";
import { t } from "i18next";
import { axiosInstance } from "../api/apiClient";
import { DELIVERY_ORDERS, ORDER_LIST, PICKUP_ORDERS } from "../api/Constants";

interface CancelModalProps {
  closeCancellationModal: () => void;
  order: any;
  sendingOrder: any;
  selectedOrders: { [key: string]: boolean },
  selectedOrdersList: any;
}

function CancelModal({closeCancellationModal,selectedOrders,sendingOrder,selectedOrdersList}: CancelModalProps) {
  const { reasons, userInfo, navbarButtons, setSendingTasks, setRecieptTasks } = useContext(Context);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedReasonText, setSelectedReasonText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false); // Added for smoother close

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

    const path = location.pathname;
    const orderId = path.split("/").pop();

    console.log(selectedOrders, orderId)

    const matchedOrder = selectedOrdersList.find(
      (order: any) =>
        order.tracking_code === orderId &&
        order.places &&
        order.places.length > 0
    );

    const checkedOrders = Object.keys(selectedOrders)
      .filter((tracking_code) => selectedOrders[tracking_code]) 
      .map((tracking_code) => ({
        tracking_code,
        successfully: "False",
        reason_id: selectedReason,
        reason_commentary: selectedReasonText,
    }));
      
    if (checkedOrders.length === 0 && !matchedOrder) {
      setError("No orders selected for cancelation");
      return;
    }

    setError("");
    setLoading(true);

    const componentParcel = [
      {
        tracking_code: orderId,
        successfully: "False",
        reason_id: selectedReason,
        reason_commentary: selectedReasonText,
      },
    ];

    const params = {
      device_id: userInfo.device_id,
      payment_type: "cash",
      orders: matchedOrder ? componentParcel : checkedOrders,
      other_recipient :  '',
      relationship_code: '',
      relationship_commentary : '',
      IsReturn: false,
    };

    try {
      const url = sendingOrder ? DELIVERY_ORDERS : PICKUP_ORDERS;
      const response = await axiosInstance.post(url, params);

      console.log(response)
      await fetchUpdatedOrderList();
      setIsClosing(true); // Trigger close animation
      setError("");
    } catch (error) {
      console.error("Failed to cancel the order:", error);
      setError(
        t("An error occurred while cancelling the order. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      window.history.back();
      closeCancellationModal();
    }
  };

  return (
    <div
      className={`w-full h-full fixed left-1/2 top-0 pt-[90px] transform -translate-x-1/2 bg-black bg-opacity-50 flex items-start justify-center z-50 ${
        isClosing ? "opacity-0 transition-opacity duration-300" : "opacity-100"
      }`}
      onTransitionEnd={handleAnimationEnd}
    >
      <div className="bg-white rounded-lg p-6 w-2/3 max-sm:w-3/4">
        <h2 className="text-lg font-bold mb-4 text-center">
          {t("Select Reason")}
        </h2>

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

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
            onClick={() => setIsClosing(true)}
            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={confirmCancellation}
            className={`px-4 py-2 text-black font-semibold rounded-md ${
              loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              t("Confirm")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
