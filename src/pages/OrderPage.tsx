import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";
import { changeOrderStatus } from "../api/requestHandlers";
import { t } from "i18next";
import PaymentModal from "../components/deliveryConfirm";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { sendingTasks, recieptTasks, userInfo, reasons } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedReasonText, setSelectedReasonText] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState(false);

  const order =
    sendingTasks.find((task) => task.tracking_code === id) ||
    recieptTasks.find((task) => task.tracking_code === id);

  if (!order) {
    return <div className="p-4">{t("Order not found")}</div>;
  }

  const handleStatusChange = async (newStatus: string) => {
    const params = {
      device_id: userInfo.device_id,
      status: newStatus,
      orders: [id],
    };

    try {
      const response = await changeOrderStatus(params);
      console.log("Order status updated successfully:", response);
      window.history.back();
    } catch (error: any) {
      console.error("Failed to update order status:", error);
    }
  };

  const openCancellationModal = () => setIsModalOpen(true);
  const closeCancellationModal = () => setIsModalOpen(false);

  const confirmCancellation = () => {
    if (selectedReason || selectedReasonText) {
      // const reasonToSend = selectedReasonText || selectedReason;
      handleStatusChange("Undelivered");
      closeCancellationModal();
    } else {
      alert(t("Please select or modify a reason for cancellation"));
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-12">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 text-lg"
        >
          <span>&larr;</span>
        </button>
        <h1 className="text-lg font-bold mx-auto">{t("order details")}</h1>
      </header>

      {/* Order Details */}
      <div className="border rounded-lg divide-y divide-gray-200 text-gray-700">
        <div className="p-4 flex justify-between">
          <span>{t("name")} :</span>
          <span className="font-medium">{order.client_name}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("address")}:</span>
          <span className="font-medium text-right">{order.client_address}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("phone")} :</span>
          <span className="font-medium text-blue-500">
            {order.client_phone}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("barcode")} :</span>
          <span className="font-medium">{order.tracking_code}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("sum")} :</span>
          <span className="font-medium">{order.sum} ₾</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("status")} :</span>
          <span className="font-medium">{order.Status}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center p-8">
        {order.Status === "Accepted" && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleStatusChange("Completed")}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
            >
              {t("hand over")}
            </button>
            <button
              onClick={openCancellationModal}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
            >
              {t("cancellation")}
            </button>
          </div>
        )}
      </div>

      {/* Modal for Cancellation Reasons */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/2">
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

            <div className="mt-4 flex justify-end space-x-4">
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
          <PaymentModal
            isOpen={confirmModal}
            onClose={() => setConfirmModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage;
