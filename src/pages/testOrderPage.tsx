import { t } from "i18next";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CancelModal from "../components/CancelModal";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";

const TestOrderPage = () => {

  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-4">{t("Loading...")}</div>;

interface Order {
    client_name: string;
    client_address: string;
    client_phone: string;
    tracking_code: string;
    sum: number;
    Status: string;
}

interface Data {
    sendingTasks: Order[];
}

const order: Order | undefined = (data as Data).sendingTasks.find((task) => task.tracking_code === id);

  if (!order) {
    return <div className="p-4">{t("Order not found")}</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-24">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button onClick={() => window.history.back()} className="text-gray-500 text-4xl">
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
          <span
            onClick={() => navigator.clipboard.writeText(order.client_phone)}
            className="font-medium text-blue-500 underline cursor-pointer"
          >
            {order.client_phone}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t("barcode")} :</span>
          <span
            onClick={() => navigator.clipboard.writeText(order.tracking_code)}
            className="font-medium text-blue-500 underline cursor-pointer"
          >
            {order.tracking_code}
          </span>
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
            <Button onClick={() => setIsConfirmModalOpen(true)} className="bg-yellow-400 text-black">
              {t("hand over")}
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="bg-yellow-400 text-black">
              {t("cancellation")}
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <CancelModal order={order} sendingOrder={order} closeCancellationModal={() => setIsModalOpen(false)} />
      )}
      {isConfirmModalOpen && (
        <ConfirmModal sendingOrder={order} receiptOrder={order} closeModal={() => setIsConfirmModalOpen(false)} />
      )}
    </div>
  );
};

export default TestOrderPage;
