import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../App";

const useOpenActiveTask = () => {
  const { sendingTasks } = useContext(Context);
  const navigate = useNavigate();

  const handleConfirmAllTasks = (trackingCode: string) => {
    const task = sendingTasks.find((task) => task.tracking_code === trackingCode);
    
    if (!task) {
      console.warn(`Order with tracking code ${trackingCode} not found`);
      return;
    }

    // Find all orders with the same phone number
    const samePhoneTasks = sendingTasks.filter(
      (order) => order.client_phone === task.client_phone
    );

    if (samePhoneTasks.length > 0) {
      // Get the first address (assuming first order's address is the main address)
      const mainAddress = samePhoneTasks[0].client_address;

      // Separate same-address and different-address orders
      const differentAddressOrders = samePhoneTasks.filter(
        (order) => order.client_address !== mainAddress
      );

      navigate(`/order/${samePhoneTasks[0].tracking_code}`, {
        state: {
          selectedOrdersList: samePhoneTasks,
          differentAddressOrders,
        },
      });
    }
  };

  return { handleConfirmAllTasks };
};

export default useOpenActiveTask;
