import { axiosInstance } from "./apiClient"
import { changeStatusesOfOrder } from "./Constants"

export const changeOrderStatus = async (params: Record<string, any>) => {
    try {
      const response = await axiosInstance.post(changeStatusesOfOrder, params);
      console.log(response.data)
      return response.data; 
    } catch (error) {
      console.error("Error changing order status:", error);
      throw error; 
    }
  };