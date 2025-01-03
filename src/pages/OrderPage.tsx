import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";
import { changeOrderStatus } from "../api/requestHandlers";
import { t } from "i18next";
import CancelModal from "../components/CancelModal";
import Button from "../components/Button";
import PaymentModal from "../components/deliveryConfirm";


const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { sendingTasks, recieptTasks, userInfo } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCancellationModal = () => setIsModalOpen(true);
  const closeCancellationModal = () => setIsModalOpen(false);
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

// <<<<<<< fixstatuschange
//   const handleConfirmHandOver = async (
//     paymentMethod: string,
//     confirmationMethod: string,
//     confirmationValue: string
//   ) => {
//     const params = {
//       device_id: userInfo.device_id,
//       status: "Completed",
//       orders: [order.tracking_code],
//       payment_method: paymentMethod,
//       confirmation_method: confirmationMethod,
//       confirmation_value: confirmationValue,
//     };
//     try {
//       const response = await changeOrderStatus(params);
//       console.log("Handover confirmed successfully:", response);
//       window.history.back();
//     } catch (error: any) {
//       console.error("Failed to confirm handover:", error);
// =======

//   const confirmCancellation = () => {
//     if (selectedReason || selectedReasonText) {
//       // const reasonToSend = selectedReasonText || selectedReason;
//       handleStatusChange("Undelivered");
//       closeCancellationModal();
//     } else {
//       alert(t("Please select or modify a reason for cancellation"));
// >>>>>>> main
//     }
//   };

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
            <Button
              onClick={openConfirmModal}
              className="bg-yellow-400 text-black"
            >
              {t("hand over")}
            </Button>
            <Button
              onClick={openCancellationModal}
              className="bg-yellow-400 text-black"
            >
              {t("cancellation")}
            </Button>
          </div>
        )}
        {order.Status === "Waiting" && (
          <div className="flex space-x-4">
            <Button
              onClick={() => handleStatusChange("Accepted")}
              className="bg-yellow-400 text-black
            >
              {t("accept")}
            </Button>
          </div>
        )}
        {order.Status === "Canceled" && (
          <div className="flex space-x-4">
            <Button
              onClick={() => handleStatusChange("Accepted")}
              className="bg-yellow-400 text-black"
            >
              {t("recovery")}
            </Button>
          </div>
        )}
      </div>


      {/* Modal for Cancellation Reasons */}
      {isModalOpen &&  <CancelModal closeCancellationModal={closeCancellationModal} handleStatusChange={handleStatusChange}/>}
      {isConfirmModalOpen && (
        <ConfirmModal
          closeModal={closeConfirmModal}
          handleConfirm={handleConfirmHandOver}
        />
      )}
    </div>
  );
};

export default OrderPage;
