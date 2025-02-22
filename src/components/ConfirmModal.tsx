import { useContext, useState, useEffect } from "react";
import Button from "../components/Button";
import {
  CHECK_OTP_CONFIRMATION,
  DELIVERY_ORDERS,
  ORDER_LIST,
  PICKUP_ORDERS,
  SEND_CLIENT_OTP,
  SET_CLIENT_ID_URL,
  VERIFY_CLIENT_OTP_URL,
} from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import ThirdPerson from "./ThirdPerson";
import useRequestLogs from "../hooks/useRequestLogs";

interface ConfirmModalProps {
  closeModal: () => void;
  receiptOrder: any;
  sendingOrder: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  closeModal,
  receiptOrder,
  sendingOrder,
}) => {
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
  const [thirdPerson, setThirdPerson] = useState(false);
  const { userInfo, setSendingTasks, setRecieptTasks, navbarButtons } =
    useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { addParcel } = useRequestLogs();
  const PARCELS_KEY = "parcels";
  const storedParcels = JSON.parse(localStorage.getItem(PARCELS_KEY) || "[]");
  console.log(storedParcels);
  const order = sendingOrder || receiptOrder;

  const navigationfunction = () => {
    if (confirmationMessage) {
      if (sendingOrder) {
        navigate("/sending");
      } else {
        navigate("/reciept");
      }
    }
  };

  useEffect(() => {
    const getOtp = async () => {
      try {
        const response = await axiosInstance.get(CHECK_OTP_CONFIRMATION, {
          params: {
            telegram_id: "6087086146",
            tracking_code: order.tracking_code,
          },
        });
        // console.log(order.tracking_code);
        console.log(storedParcels);
        if (response.data.response.otp_confirmed) {
          const otp = storedParcels.find(
            (barcode: any) => barcode == order.trackingNumber
          );
          console.log(otp);
        }
      } catch (error) {}
    };
    getOtp();
  }, []);

  useEffect(() => {
    if (startTimer) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(countdown);
        closeModal();
        window.history.back();
      }

      return () => clearInterval(countdown);
    }
  }, [timer, startTimer, closeModal]);

  // Countdown for OTP cooldown
  useEffect(() => {
    if (otpCooldown > 0) {
      const interval = setInterval(() => {
        setOtpCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpCooldown]);

  const handleConfirmationMethodChange = (method: string) => {
    setConfirmationMethod(method);
    setConfirmationValue("");
    setOtpSent(false);
    setOtpCooldown(0);
    setConfirmationMessage("");
    setErrorMessage("");
  };

  const confirmDelivery = async () => {
    const params = {
      device_id: userInfo.device_id,
      payment_type: order.sum == 0 ? null : paymentMethod,
      orders: [
        {
          tracking_code: order.tracking_code,
          successfully: "True",
          reason_id: "",
          reason_commentary: "",
        },
      ],
    };

    try {
      const url = order == receiptOrder ? PICKUP_ORDERS : DELIVERY_ORDERS;
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

  const onConfirm = async () => {
    setLoading(true);
    try {
      if (receiptOrder) {
        await confirmDelivery();
        addParcel(
          order.tracking_code,
          confirmationValue,
          order.client_name,
          "completed"
        );
        setConfirmationMessage(t("Receipt order confirmed!"));
        setStartTimer(true);
        await fetchUpdatedOrderList();
      } else if (confirmationMethod === "OTP") {
        try {
          await checkClientOtp();
        } catch (error) {
          addParcel(
            order.tracking_code,
            confirmationValue,
            order.client_name,
            "failed"
          );
        }
        await fetchUpdatedOrderList();
      } else if (confirmationMethod === "ID Number") {
        if (order.client_id) {
          if (order.client_id === confirmationValue) {
            await confirmDelivery();
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "completed"
            );
            setConfirmationMessage(t("ID Number confirmed!"));
            setStartTimer(true);
            await fetchUpdatedOrderList();
          } else {
            setErrorMessage(
              t(
                "The ID Number does not match the client's ID. Please try again."
              )
            );
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "failed"
            );
          }
        } else {
          try {
            await postClientID();
          } catch (error) {
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "failed"
            );
          }
          await fetchUpdatedOrderList();
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage(
        t("An unexpected error occurred. Please try again later.")
      );
      addParcel(
        order.tracking_code,
        confirmationValue,
        order.client_name,
        "failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const closeThirdPerosnModal = () => {
    setThirdPerson(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {thirdPerson && (
        <ThirdPerson
          onConfirm={onConfirm}
          navigationfunction={navigationfunction}
          loading={loading}
          closeThirdPerosnModal={closeThirdPerosnModal}
          confirmationMessage={confirmationMessage}
        />
      )}
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">
          {sendingOrder ? t("Confirm Handover") : t("Confirm Receiving")}
        </h2>

        {confirmationMessage ? (
          <div>
            <p className="text-green-500 text-center mb-4">
              {confirmationMessage}
            </p>
            <p className="text-sm text-gray-500 text-center">
              {t("This modal will close in {{timer}} seconds.", { timer })}
            </p>
          </div>
        ) : (
          <>
            {order.sum != 0 && (
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  {t("Payment Method")}
                </label>
                <select
                  value={paymentMethod ?? ""}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Cash">{t("Cash")}</option>
                  <option value="bank_card">{t("Bank")}</option>
                </select>
              </div>
            )}

            {sendingOrder && (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    {t("Confirmation Method")}
                  </label>
                  <select
                    value={confirmationMethod}
                    onChange={(e) =>
                      handleConfirmationMethodChange(e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="OTP">{t("OTP")}</option>
                    <option value="ID Number">{t("ID Number")}</option>
                  </select>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all"
                  onClick={() => setThirdPerson(!thirdPerson)}
                >
                  მესამე პირი
                </button>

                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    {confirmationMethod === "OTP"
                      ? t("Enter OTP Code")
                      : t("Enter ID Number")}
                  </label>
                  {confirmationMethod === "OTP" && (
                    <Button
                      onClick={sendOtp}
                      className="mb-2 bg-blue-500 text-black"
                      disabled={otpCooldown > 0 || isOtpSending}
                    >
                      {isOtpSending
                        ? t("Sending OTP...")
                        : otpCooldown > 0
                        ? t("Wait {{otpCooldown}}s", { otpCooldown })
                        : t("Send OTP")}
                    </Button>
                  )}

                  {otpSent && (
                    <div className="text-green-500">{t("OTP Sent!")}</div>
                  )}
                  <input
                    type="text"
                    value={confirmationValue}
                    onChange={(e) => setConfirmationValue(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={
                      confirmationMethod === "OTP"
                        ? t("OTP Code")
                        : t("ID Number")
                    }
                  />
                  {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            onClick={confirmationMessage ? navigationfunction : closeModal}
            className={`g-gray-300 text-black `}
          >
            {t("cancel")}
          </Button>
          {!confirmationMessage && (
            <Button
              onClick={onConfirm}
              disabled={loading} // Disable button when loading
              className={`g-gray-300 text-black ${
                loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  <span className="ml-2">{t("loading")}</span>
                </div>
              ) : (
                t("confirm")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
