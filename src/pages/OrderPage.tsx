import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";
import { changeOrderStatus } from "../api/requestHandlers";
import { t } from "i18next";
import CancelModal from "../components/CancelModal";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import { axiosInstance } from "../api/apiClient";
import { ORDER_LIST } from "../api/Constants";
import { useLocation } from "react-router-dom";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    sendingTasks,
    recieptTasks,
    userInfo,
    setSendingTasks,
    navbarButtons,
    setRecieptTasks,
  } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCancellationModal = () => setIsModalOpen(true);
  const closeCancellationModal = () => setIsModalOpen(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const sendingOrder = sendingTasks.find((task) => task.tracking_code === id);
  const receiptOrder = recieptTasks.find((task) => task.tracking_code === id);

  const order = sendingOrder || receiptOrder;

  const location = useLocation();
  const { selectedOrdersList } = location.state || { selectedOrdersList: [] };

  if (!order) {
    return <div className="p-4">{t("Order not found")}</div>;
  }

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

  const handleStatusChangeAndFetch = async (newStatus: string) => {
    const params = {
      device_id: userInfo.device_id,
      status: newStatus,
      orders: [id],
    };
    setLoading(true);
    try {
      const response = await changeOrderStatus(params);
      console.log("Order status updated successfully:", response);

      // Wait for the status update to complete before fetching the updated list
      await fetchUpdatedOrderList();
      window.history.back();
    } catch (error: any) {
      console.error(
        "Failed to update order status or fetch updated list:",
        error
      );
    } finally {
      setLoading(false); // Reset loading to false after the operation
    }
  };

  const handleRecoveryClick = async () => {
    setLoading(true); // Set loading to true before the async operation
    try {
      await handleStatusChangeAndFetch("Accepted"); // Perform the async action
    } catch (error) {
      console.error("Recovery failed:", error);
    } finally {
      setLoading(false); // Reset loading to false after the operation
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-24">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 text-4xl"
        >
          <span>&larr;</span>
        </button>
        <h1 className="text-lg font-bold mx-auto">{t("order details")}</h1>
      </header>

      {/* Order Details */}
      <div className="border rounded-lg divide-y divide-gray-200 text-gray-700">
        <div className="p-2 flex justify-between">
          <span>{t("name")} :</span>
          <span className="font-medium">{order.client_name}</span>
        </div>
        <div className="p-2 flex justify-between">
          <span>{t("address")}:</span>
          <span className="font-medium text-right">{order.client_address}</span>
        </div>
        <div className="p-2 flex justify-between">
          <span>{t("phone")} :</span>
          <span
            onClick={() => navigator.clipboard.writeText(order.client_phone)}
            className="font-medium text-blue-500 underline cursor-pointer"
          >
            {order.client_phone}
          </span>
        </div>
        <div className="p-2 flex justify-between">
          <span>{t("status")} :</span>
          <span className="font-medium">{order.Status}</span>
        </div>
      </div>

      <ul className="mt-6">
        {selectedOrdersList.map((order: { tracking_code: string; sum: number }) => (
          <li key={order.tracking_code}
          className="border border-black text-gray-700 rounded-lg"> 
              <div className="p-1 flex justify-between">
                <span>{t("barcode")} :</span>
                <span
                  onClick={() => navigator.clipboard.writeText(order.tracking_code)}
                  className="font-medium text-blue-500 underline cursor-pointer"
                >
                  {order.tracking_code}
                </span>
              </div>
              <div className="p-1 flex justify-between">
                <span>{t("sum")} :</span>
                <span className="font-medium">{order.sum} ₾</span>
              </div>
          </li>
        ))}
      </ul>

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
              onClick={() => {
                handleStatusChangeAndFetch("Accepted");
              }}
              disabled={loading}
              className={`bg-yellow-400 text-black ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  <span className="ml-2">{t("loading")}</span>
                </div>
              ) : (
                t("accept")
              )}
            </Button>
          </div>
        )}
        {order.Status === "Canceled" && (
          <div className="flex space-x-4">
            <Button
              onClick={handleRecoveryClick}
              disabled={loading} // Disable button while loading
              className={`bg-yellow-400 text-black ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  <span className="ml-2">{t("loading")}</span>
                </div>
              ) : (
                t("recovery")
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Cancellation Reasons */}
      {isModalOpen && (
        <CancelModal
          order={order}
          closeCancellationModal={closeCancellationModal}
          sendingOrder={sendingOrder}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          closeModal={closeConfirmModal}
          sendingOrder={sendingOrder}
          receiptOrder={receiptOrder}
        />
      )}
    </div>
  );
};

export default OrderPage;
