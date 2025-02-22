import { useParams, useLocation } from "react-router-dom";
import { t } from "i18next";
import useOrder from "../hooks/order page hooks/useOrder";
import useOrderStatus from "../hooks/order page hooks/useOrderStatus";
import useModal from "../hooks/order page hooks/useModal";
import CancelModal from "../components/CancelModal";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedOrdersList = [], differentAddressOrders = false } = useLocation().state || {};

  const { selectedOrders, totalSum, totalQuantity, handleCheckboxChange } = useOrder(selectedOrdersList);
  const { order, sendingOrder, receiptOrder, loading, handleStatusChangeAndFetch, handleRecoveryClick } = useOrderStatus(id!);
  const { isModalOpen, isConfirmModalOpen, openCancellationModal, closeCancellationModal, openConfirmModal, closeConfirmModal} = useModal();

  
  if (!order) {
    return <div className="p-4">{t("Order not found")}</div>;
  }
  return (
    <div className="min-h-screen bg-white px-4 pt-24 h-sm:pt-12">
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
        <div className="p-1 flex justify-between">
          <span className="font-base text-sm">{t("name")} :</span>
          <span className="font-base">{order.client_name}</span>
        </div>
        <div className="p-1 flex justify-between">
            <span className="font-base text-sm">{t("address")}:</span>
            <span className="font-base text-right">{order.client_address}</span>
        </div>
        <div className="p-1 flex justify-between">
          <span className="font-base text-sm">{t("phone")} :</span>
          <span
            onClick={() => navigator.clipboard.writeText(order.client_phone)}
            className="font-base text-blue-500 underline cursor-pointer"
          >
            {order.client_phone}
          </span>
        </div>
        <div className="p-2 flex justify-between">
          <span className="font-base text-sm">{t("status")} :</span>
          <span className="font-base">{order.Status}</span>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-2 overflow-y-auto h-60">
        {selectedOrdersList.map((order: { tracking_code: string; sum: number , client_address: string}) => (
          <li key={order.tracking_code}
          className={`border-2 ${differentAddressOrders.some((diffOrder: any) => diffOrder.tracking_code === order.tracking_code) ? "border-red-600" : "border-black"} text-gray-700 rounded-lg flex gap-3 px-3`}
          > 
          <input
              type="checkbox"
              checked={!!selectedOrders[order.tracking_code]}
              onChange={() => handleCheckboxChange(order.tracking_code)}
            />
          <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between items-center">
                <span className="font-base text-xs">{t("barcode")} :</span>
                <span
                  onClick={() => navigator.clipboard.writeText(order.tracking_code)}
                  className="text-sm text-blue-500 underline cursor-pointer"
                >
                  {order.tracking_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-base text-sm">{t("address")}:</span>
                <span className="font-base text-sm text-right">{order.client_address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-base text-sm">{t("sum")} :</span>
                <span className="font-base text-sm">{order.sum} ₾</span>
              </div>
          </div>
          </li>
        ))}
      </ul>


      {/* Action Buttons */}
      <div className="flex justify-center p-5">
        {order.Status === "Accepted" && (
          <div className="flex flex-col gap-2">
            <div className="p-1 flex justify-between">
              <span>{t("Total quantity")} :</span>
              <span className="font-medium">{totalQuantity}</span>
            </div>
            <div className="p-1 flex justify-between">
              <span>{t("Total amount")} :</span>
              <span className="font-medium">{totalSum} ₾</span>
            </div>
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
