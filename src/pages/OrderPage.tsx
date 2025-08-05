import { useParams, useLocation } from "react-router-dom";
import useOrder from "../hooks/order page hooks/useOrder";
import useOrderStatus from "../hooks/order page hooks/useOrderStatus";
import useModal from "../hooks/order page hooks/useModal";
import CancelModal from "../components/CancelModal";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import ConfimParcelScanner from "../components/ConfirmScanner";
import { useState } from "react";
import OrderWithComponents from "../components/order page components/OrderWithComponents";
import SameClientsOrders from "../components/order page components/SameClientsOrders";
import ComponentParcelError from "../components/ComponentParcelError";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedOrdersList = [], differentAddressOrders = false } =
    useLocation().state || {};
  const [isScanning, setIsScanning] = useState(false);
  const {
    setSelectedOrders,
    selectedOrders,
    totalSum,
    totalSumCash,
    totalQuantity,
    handleCheckboxChange,
  } = useOrder(selectedOrdersList);
  const {
    order,
    sendingOrder,
    receiptOrder,
    loading,
    handleStatusChangeAndFetch,
    handleRecoveryClick,
  } = useOrderStatus(id!);
  const {
    isModalOpen,
    isConfirmModalOpen,
    openCancellationModal,
    closeCancellationModal,
    openConfirmModal,
    closeConfirmModal,
    openComponentParcelErrorModal,
    closeComponentParcelErrorModal,
    componentParcelErrorModal,
  } = useModal();

  const { t } = useTranslation();

  if (!order) {
    return <div className="p-4">{t("Order not found")}</div>;
  }

  const path = location.pathname;
  const orderId = path.split("/").pop();

  const matchedOrder = selectedOrdersList.find(
    (order: any) =>
      order.tracking_code === orderId && order.places && order.places.length > 0
  );
  const allTrue = Object.values(selectedOrders).every(
    (value) => value === true
  );

  const handleScanerChange = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-24 h-sm:pt-12">
      {isScanning ? (
        <ConfimParcelScanner
          selectedOrdersList={selectedOrdersList}
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
          setIsScanning={setIsScanning}
        />
      ) : (
        <>
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

            {(order.Status !== "Accepted" || order?.places) && (
              <div className="p-1 flex justify-between">
                <span className="font-base text-sm">{t("barcode")} :</span>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(order.tracking_code)
                  }
                  className="text-sm text-blue-500 underline cursor-pointer"
                >
                  {order.tracking_code}
                </span>
              </div>
            )}
            <div className="p-1 flex justify-between">
              <span className="font-base text-sm">{t("address")}:</span>
              <span className="font-base text-right">
                {order.client_address}
              </span>
            </div>
            <div className="p-1 flex justify-between">
              <span className="font-base text-sm">{t("phone")} :</span>

              <span
                onClick={() =>
                  window.open(`tel:${order.client_phone}`, "_blank")
                }
                className="font-base text-blue-500 underline cursor-pointer"
              >
                {order.client_phone}
              </span>
              {/* WhatsApp Icon Link */}
              <span>
                <a
                  href={`https://wa.me/${order.client_phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in WhatsApp"
                >
                  {" "}
                  {order.client_phone}
                </a>
              </span>
              {/* Viber Icon Link */}
              <span>
                <a
                  href={`viber://call?number=${order.client_phone}`}
                  title="Call on Viber"
                >
                  {" "}
                  {order.client_phone}
                </a>
              </span>
            </div>
            {(order.Status !== "Accepted" || order?.places) && (
              <div className="p-1 flex justify-between items-center">
                <span className="font-base text-sm">{t("sum")} :</span>
                {order.sumcash == order.sum ? (
                  <span className="font-bold text-sm text-blue-700">
                    {order.sum} ₾
                  </span>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm text-blue-700">
                        {t("Cash2")}
                      </span>
                      <span className="font-bold text-sm text-blue-700">
                        {order.sumcash} ₾
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm text-blue-700">
                        {t("Bank")}
                      </span>
                      <span className="font-bold text-sm text-blue-700">
                        {order.sum} ₾
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="p-1 flex justify-between">
              <span className="font-base text-sm">{t("status")} :</span>
              <span className="font-base">{order.Status}</span>
            </div>
            <div className="p-1 flex justify-between">
              <span className="font-bold text-sm  text-red-600">
                {t("Returnable")} :
              </span>
              <span className="font-bold text-red-600">
                {order.parcel_with_return ? t("yes") : t("no")}
              </span>
            </div>
            {/* Parcel With Return barcode*/}
            {order?.parcel_with_return && (
              <div className="p-1 flex justify-between">
                <span className="font-bold text-sm text-red-600">
                  {t("Returnable barcode")} :
                </span>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(order.tracking_code)
                  }
                  className="font-semibold text-red-600 underline cursor-pointer"
                >
                  {order.parcel_with_return_barcode}
                </span>
              </div>
            )}
          </div>

          {order?.with_places ? (
            <OrderWithComponents
              order={order}
              handleCheckboxChange={handleCheckboxChange}
              selectedOrders={selectedOrders}
            />
          ) : (
            <SameClientsOrders
              selectedOrdersList={selectedOrdersList}
              differentAddressOrders={differentAddressOrders}
              handleCheckboxChange={handleCheckboxChange}
              selectedOrders={selectedOrders}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-center p-5">
            {order.Status === "Accepted" && (
              <div className="flex flex-col gap-2">
                <div className="p-1 flex justify-between">
                  <span>{t("Total quantity")} :</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("Total amount")} :</span>
                  {totalSumCash === totalSum ? (
                    <span className="font-medium text-s text-blue-700">
                      {totalSum} ₾
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-blue-700">
                        {t("Cash2")} {totalSumCash} ₾
                      </span>
                      <span className="font-medium text-xs text-blue-700">
                        {t("Bank")} {totalSum} ₾
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => {
                      if ((matchedOrder && allTrue) || !matchedOrder) {
                        openConfirmModal();
                      } else {
                        openComponentParcelErrorModal();
                      }
                    }}
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
                <Button onClick={handleScanerChange}>
                  {t("scan barcode")}
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
              selectedOrders={selectedOrders}
              selectedOrdersList={selectedOrdersList}
            />
          )}
          {isConfirmModalOpen && (
            <ConfirmModal
              closeModal={closeConfirmModal}
              sendingOrder={sendingOrder}
              receiptOrder={receiptOrder}
              selectedOrders={selectedOrders}
              totalSum={String(totalSum)}
              selectedOrdersList={selectedOrdersList}
            />
          )}
          {componentParcelErrorModal && (
            <ComponentParcelError
              closeComponentParcelErrorModal={closeComponentParcelErrorModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
