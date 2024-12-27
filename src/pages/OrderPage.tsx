import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>(); // 'id' now holds the tracking_code
  const { sendingTasks, recieptTasks } = useContext(Context);

  // Find the order using tracking_code
  const order =
    sendingTasks.find((task) => task.tracking_code === id) ||
    recieptTasks.find((task) => task.tracking_code === id);

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }

  // if (order) {
  //   const orderParams = {
  //     device_id: userInfo.device_id,
  //     status: "accepted",
  //     orders: trackingCodes,
  //   };
  // }

  return (
    <div className="min-h-screen bg-white px-4 pt-12">
      <header className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 text-lg"
        >
          <span>&larr;</span>
        </button>
        <h1 className="text-lg font-bold mx-auto">ამანათის დეტალები</h1>
      </header>

      <div className="border rounded-lg divide-y divide-gray-200 text-gray-700">
        <div className="p-4 flex justify-between">
          <span>სახელი :</span>
          <span className="font-medium">{order.client_name}</span>
        </div>
        <div className="p-4 flex justify-between">
          <p>მისამართი:</p>
          <p className="font-medium text-right">{order.client_address}</p>
        </div>
        <div className="p-4 flex justify-between">
          <span>ტელეფონი :</span>
          <span className="font-medium text-blue-500">
            {order.client_phone}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span>ბარკოდი :</span>
          <span className="font-medium">{order.tracking_code}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>თანხა :</span>
          <span className="font-medium">{order.sum} ₾</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>სტატუსი :</span>
          <span className="font-medium">{order.Status}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center p-8">
        {order.Status === "Waiting" && (
          <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md">
            მიღება
          </button>
        )}
        {order.Status === "Canceled" && (
          <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md">
            აღდგენა
          </button>
        )}
        {order.Status === "Accepted" && (
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md">
              ჩაბარება
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md">
              გაუქმება
            </button>
          </div>
        )}
        {/* No buttons for "Completed" */}
      </div>
    </div>
  );
};

export default OrderPage;
