import { useContext, useState } from "react";
import { Context } from "../../App";
import useRequestLogs from "../useRequestLogs";
import {axiosInstance} from "../../api/apiClient"
import { PICKUP_ORDERS, DELIVERY_ORDERS, SEND_CLIENT_OTP, VERIFY_CLIENT_OTP_URL, SET_CLIENT_ID_URL, ORDER_LIST, CHECK_OTHER_PERSON } from "../../api/Constants";
import { t } from "i18next";



const useClientConfirmation = (
    selectedOrders: { [key: string]: boolean },
    totalSum: string,
    sendingOrder: any,
    receiptOrder: any
) => {

    const [paymentMethod, setPaymentMethod] = useState<string | null>("Cash");
    const [confirmationMethod, setConfirmationMethod] = useState("OTP");
    const [confirmationValue, setConfirmationValue] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [otpCooldown, setOtpCooldown] = useState(0); // Cooldown timer for OTP
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(2);
    const [startTimer, setStartTimer] = useState(false);
    const { userInfo, setSendingTasks, setRecieptTasks, navbarButtons } = useContext(Context);
    const [loading, setLoading] = useState<boolean>(false);
    const [otherPersonInfo, setOtherPersonInfo] = useState<boolean>(false);
    const [otherClientName, setOtherClientName] = useState<string>("");
    const [otherClientSurname, setOtherClientSurname] = useState<string>("");

    const order = sendingOrder || receiptOrder;
  const { addParcel } = useRequestLogs();


    const handleConfirmationMethodChange = (method: string) => {
        setConfirmationMethod(method);
        setConfirmationValue("");
        setOtpSent(false);
        setOtpCooldown(0);
        setConfirmationMessage("");
        setErrorMessage("");
        if(method === "Other"){
          setOtherPersonInfo(true)
        }else{
          setOtherPersonInfo(false)
        }
    };

    
    // **Check if another client exists**
    const checkOtherClient = async () => {
    
      // const params = {
      //   client_id: confirmationValue,
      // };

      // console.log(params)
    
      try {
        const response = await axiosInstance.get(CHECK_OTHER_PERSON, { params: { client_id: confirmationValue } });
    
        if (response.data.status) {
          setOtherPersonInfo(true);
          setOtherClientName(response.data.client_name || "");
          setOtherClientSurname(response.data.client_surname || "");
        } else {
          setOtherPersonInfo(false);
        }
      } catch (error) {
        console.error("Error checking other client:", error);
      }
    };
    
    // **Add another client**
    const addOtherClient = async (clientName: string, clientSurname: string) => {
    
      const params = {
        client_id: confirmationValue,
        client_first_name: otherClientName,
        client_last_name:otherClientSurname,
      };
    
      try {
        const response = await axiosInstance.post(CHECK_OTHER_PERSON, params);
        
        if (response.data.status) {
          setOtherPersonInfo(true);
          setOtherClientName(clientName);
          setOtherClientSurname(clientSurname);
        }
      } catch (error) {
        console.error("Error adding other client:", error);
      }
    };
    
    
      const confirmDelivery = async () => {
        const checkedOrders = Object.keys(selectedOrders)
          .filter((tracking_code) => selectedOrders[tracking_code]) 
          .map((tracking_code) => ({
            tracking_code,
            successfully: "True",
            reason_id: "",
            reason_commentary: "",
          }));
      
        if (checkedOrders.length === 0) {
          console.warn("No orders selected for confirmation");
          return;
        }

        checkOtherClient();
      
        const params = {
          device_id: userInfo.device_id,
          payment_type: parseFloat(totalSum) === 0 ? null : paymentMethod,
          orders: checkedOrders, 
          other_recipient : confirmationValue,
          relationship_code: '',
          relationship_commentary : "",
        };

        console.log(checkedOrders)
        console.log("Sending confirmation request:", params);
      
        try {
          const url = order === receiptOrder ? PICKUP_ORDERS : DELIVERY_ORDERS;
          console.log("Sending request to:", url);
          await axiosInstance.post(url, params);
          console.log("Request sent successfully to:", url);
        } catch (error) {
          console.error("Error sending request:", error);
        }
      };
      
    
      const sendOtp = async () => {
        if (!order.client_phone) {
          alert(t("Phone number is not available."));
          return;
        }
    
        try {
          setIsOtpSending(true);
          const response = await axiosInstance.post(SEND_CLIENT_OTP, {
            device_id: userInfo.device_id,
            tracking_code: order.tracking_code,
          });
          if (response.status === 200) {
            setOtpSent(true);
            setOtpCooldown(30);
          } else {
            alert(response.data.message || t("Failed to send OTP."));
          }
        } catch (error) {
          alert(t("Error sending OTP."));
        } finally {
          setIsOtpSending(false);
        }
      };
    
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
          console.log("Order list updated successfully:", response);
        } catch (error) {
          console.error("Failed to fetch order list:", error);
        }
      };
    
      const checkClientOtp = async () => {
        if (!confirmationValue) {
          setErrorMessage(t("Please enter the OTP."));
          addParcel(
            order.tracking_code,
            confirmationValue,
            order.client_name,
            "failed"
          );
          return;
        }
    
        const data = {
          device_id: userInfo.device_id,
          tracking_code: order.tracking_code,
          otp: confirmationValue,
        };
    
        try {
          const response = await axiosInstance.post(VERIFY_CLIENT_OTP_URL, data);
          if (response.status === 200) {
            await confirmDelivery();
            setConfirmationMessage(t("OTP confirmed!"));
            setErrorMessage("");
            setStartTimer(true);
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "completed"
            );
          } else {
            setErrorMessage(
              response.data.message || t("Invalid OTP. Please try again.")
            );
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "failed"
            );
          }
        } catch (error: any) {
          setErrorMessage(
            error.response?.data?.message || t("Invalid OTP. Please try again.")
          );
          addParcel(
            order.tracking_code,
            confirmationValue,
            order.client_name,
            "failed"
          );
        }
      };
    
      const postClientID = async () => {
        if (!confirmationValue.trim()) {
          setErrorMessage(t("Please enter the ID number."));
          addParcel(
            order.tracking_code,
            confirmationValue,
            order.client_name,
            "failed"
          );
          return;
        }
    
        const params = {
          device_id: userInfo.device_id,
          client_code: order.client_code,
          client_id: confirmationValue,
        };
    
        try {
          const response = await axiosInstance.post(SET_CLIENT_ID_URL, params);
          if (response.status === 202) {
            await confirmDelivery();
            setConfirmationMessage(t("ID Number confirmed!"));
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "completed"
            );
            setErrorMessage("");
            setStartTimer(true);
          } else {
            setErrorMessage(
              response.data.message ||
                t("Failed to save ID Number. Please try again.")
            );
          }
        } catch (error: any) {
          setErrorMessage(
            error.response?.data?.message ||
              t("An error occurred while saving the ID Number. Please try again.")
          );
        }
      };
    
     
      return {
          paymentMethod,
          setPaymentMethod,
          confirmationMethod,
          setConfirmationMethod,
          confirmationValue,
          setConfirmationValue,
          otpSent,
          setOtpSent,
          isOtpSending,
          setIsOtpSending,
          otpCooldown,
          setOtpCooldown,
          confirmationMessage,
          setConfirmationMessage,
          errorMessage,
          setErrorMessage,
          timer,
          setTimer,
          startTimer,
          setStartTimer,
          loading,
          setLoading,
          handleConfirmationMethodChange,
          confirmDelivery,
          sendOtp,
          fetchUpdatedOrderList,
          checkClientOtp,
          postClientID,
          checkOtherClient,
          otherPersonInfo,
          addOtherClient,
          otherClientName,
          otherClientSurname
      };
  };

  export default useClientConfirmation;