import { useContext, useState } from "react";
import { Context } from "../../App";
import { changeOrderStatus } from "../../api/requestHandlers";
import { axiosInstance } from "../../api/apiClient";
import { ORDER_LIST } from "../../api/Constants";

const useOrderStatus = (id: string) => {
  const { sendingTasks, recieptTasks, userInfo, setSendingTasks, setRecieptTasks, navbarButtons } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const sendingOrder = sendingTasks.find((task) => task.tracking_code === id);
  const receiptOrder = recieptTasks.find((task) => task.tracking_code === id);

  const order = sendingOrder || receiptOrder;

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

      await fetchUpdatedOrderList();
      window.history.back();
    } catch (error) {
      console.error("Failed to update order status or fetch updated list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryClick = async () => {
    setLoading(true);
    try {
      await handleStatusChangeAndFetch("Accepted");
    } catch (error) {
      console.error("Recovery failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    sendingOrder,
    receiptOrder,
    loading,
    handleStatusChangeAndFetch,
    handleRecoveryClick,
  };
};

export default useOrderStatus;
