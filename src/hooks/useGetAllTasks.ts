import { useContext } from "react";
import { axiosInstance } from "../api/apiClient";
import { ORDER_LIST } from "../api/Constants";
import { Context } from "../App";
import { useLocation } from "react-router-dom";


export const useGetAllTasks = () => {
  const { userInfo, setSendingTasks } = useContext(Context);
  const location = useLocation();
  const pickUp = location.pathname == "/Sending" ? false : true;

  const fetchUpdatedOrderList = async (status: string[]) => {
    try {
      const tasklistData = {
        device_id:userInfo.device_id || "6087086146",
        pickup_task: pickUp,
        status: status, // Keep the status as an array of strings
      };

      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(JSON.stringify(tasklistData)),
        },
      });
      setSendingTasks(response.data.response);
      console.log("Order list updated successfully:", response);
    } catch (error) {
      console.error("Failed to fetch order list:", error);
    }
  };

  return { fetchUpdatedOrderList };
};
