import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../App";

const useOpenActiveTask = () => {
  const { sendingTasks, recieptTasks } = useContext(Context);
  const navigate = useNavigate();

  const activeStatus = "Accepted";

  const handleConfirmAllTasks = (trackingCode: string) => {
    const task =
      sendingTasks.find((task) => task.tracking_code === trackingCode) ||
      recieptTasks.find((task) => task.tracking_code === trackingCode);

    if (!task) {
      console.warn(`Order with tracking code ${trackingCode} not found`);
      return;
    }

    // Use the selected order's address as the main address
    const mainAddress = task.client_address;

    // Find all orders with the same phone number and status
    const samePhoneTasks = [...sendingTasks, ...recieptTasks].filter(
      (order) =>
        order.client_phone === task.client_phone &&
        order.Status === activeStatus
    );

    // Separate same-address and different-address orders
    const sameAddressOrders = samePhoneTasks.filter(
      (order) =>
        order.client_address === mainAddress &&
        order.tracking_code !== trackingCode
    );
    const differentAddressOrders = samePhoneTasks.filter(
      (order) => order.client_address !== mainAddress
    );

    // Ensure the selected order is first in the array
    const selectedOrdersList = [
      task,
      ...sameAddressOrders,
      ...differentAddressOrders,
    ];
    navigate(`/order/${trackingCode}`, {
      state: {
        selectedOrdersList,
        differentAddressOrders,
      },
    });
  };

  return { handleConfirmAllTasks };
};

export default useOpenActiveTask;
