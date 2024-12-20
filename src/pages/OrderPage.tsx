import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../App";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>(); // 'id' now holds the tracking_code
  const { sendingTasks , recieptTasks } = useContext(Context);

  // Find the order using tracking_code
  const order = sendingTasks.find((task) => task.tracking_code === id) || recieptTasks.find((task) => task.tracking_code === id);

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">

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
          <span className="font-medium text-blue-500">{order.client_phone}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>ბარკოდი :</span>
          <span className="font-medium">{order.tracking_code}</span>
        </div>
        <div className="p-4 flex justify-between">
          <span>თანხა :</span>
          <span className="font-medium">{order.sum} ₾</span>
        </div>
      </div>

        {/* ღილაკები */}

        <div className="flex justify-between p-8">
            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md ">
                ჩაბარება
            </button>
            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md ">
                გაუქმება
            </button>
        </div>

    </div>
  );
};

export default OrderPage;
