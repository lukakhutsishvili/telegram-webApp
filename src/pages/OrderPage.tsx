import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";
import { changeOrderStatus } from "../api/requestHandlers";
import { changeStatusesOfOrder } from "../api/Constants"; 
import { t } from "i18next";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>(); // 'id' now holds the tracking_code
  const { sendingTasks, recieptTasks, userInfo} = useContext(Context);

  // Find the order using tracking_code
  const order =
    sendingTasks.find((task) => task.tracking_code === id) ||
    recieptTasks.find((task) => task.tracking_code === id);

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }
  
  const handleStatusChange = async (newStatus: string) => {
    const params = {
      device_id: userInfo.device_id,
      tracking_code: order.tracking_code,
      status: newStatus,
    };
  
    try {
      const response = await changeOrderStatus(params);
      console.log("Order status updated successfully:", response);
    } catch (error: any) {
      console.error("Failed to update order status:", error);
  
      console.log("Error details:", {
        url: `${changeStatusesOfOrder}/pocket/changetaskstatus`,
        method: "POST",
        headers: {
          Authorization: "Basic dGVsZWdyYW1fYm90OjY1NzE1Mg==",
          "Content-Type": "application/json",
        },
        payload: params,
        response: error.response?.data || null,
        status: error.response?.status || null,
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-white px-4 pt-12">
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 text-lg"
        >
          <span>&larr;</span>
        </button>
        <h1 className="text-lg font-bold mx-auto">{t('order details')}</h1>
      </header>

      <div className="border rounded-lg divide-y divide-gray-200 text-gray-700">
        <div className="p-4 flex justify-between">
          <span>{t('name')} :</span>
          <span className="font-medium">{order.client_name}</span>
        </div>
        <div className="p-4 flex justify-between">
          <p>{t('address')}:</p>
          <p className="font-medium text-right">{order.client_address}</p>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t('phone')} :</span>
          <span className="font-medium text-blue-500">
            {order.client_phone}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t('barcode')} :</span>
          <span className="font-medium">{order.tracking_code}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t('sum')} :</span>
          <span className="font-medium">{order.sum} ₾</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>{t('status')} :</span>
          <span className="font-medium">{order.Status}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center p-8">
        {order.Status === "Waiting" && (
          <button
            onClick={() => handleStatusChange("Accepted")}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
          >
            {t('accept')}
          </button>
        )}
        {order.Status === "Canceled" && (
          <button
            onClick={() => handleStatusChange("Accepted")}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
          >
            {t('restore')}
          </button>
        )}
        {order.Status === "Accepted" && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleStatusChange("Completed")}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
            >
              {t('hand over')}
            </button>
            <button
              onClick={() => handleStatusChange("Canceled")}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md"
            >
              {t('cancellation')}
            </button>
          </div>
        )}
        {/* No buttons for "Completed" */}
      </div>
    </div>
  );
};

export default OrderPage;
