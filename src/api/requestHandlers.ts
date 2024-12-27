import { axiosInstance } from "./apiClient"
import { changeStatusesOfOrder } from "./Constants"

export const changeOrderStatus  = async (params: any) =>{
    const response = await axiosInstance.post(changeStatusesOfOrder, params);
    return response;
}