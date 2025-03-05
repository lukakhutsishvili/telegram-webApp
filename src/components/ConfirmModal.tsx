import {  useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import {
  CHECK_OTP_CONFIRMATION,
} from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import useClientConfirmation from "../hooks/confirm modal hooks/useClientConfirmation";
import useRequestLogs from "../hooks/useRequestLogs";
import ThirdPerson from "./ThirdPerson";
import useValidation from "../hooks/confirm modal hooks/useValidation";
import { Context } from "../App";

interface ConfirmModalProps {
  closeModal: () => void;
  receiptOrder: any;
  sendingOrder: any;
  selectedOrders: { [key: string]: boolean };
  totalSum: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  closeModal,
  receiptOrder,
  selectedOrders,
  sendingOrder,
  totalSum,
}) => {

  const navigate = useNavigate();
  const PARCELS_KEY = "parcels";
  const storedParcels = JSON.parse(localStorage.getItem(PARCELS_KEY) || "[]");
  const order = sendingOrder || receiptOrder;

  const { addParcel } = useRequestLogs();

  const { paymentMethod, setPaymentMethod,confirmationMethod,confirmationValue,setConfirmationValue,otpSent,
    isOtpSending,otpCooldown,setOtpCooldown,confirmationMessage, errorMessage,timer,setTimer,startTimer,
    loading ,handleConfirmationMethodChange, sendOtp, confirmDelivery, setLoading, postClientID,
    setConfirmationMessage, setStartTimer,fetchUpdatedOrderList, checkClientOtp ,setErrorMessage, checkOtherClient,addOtherClient,
    otherPersonInfo, otherClientName, otherClientSurname, setOtherClientName, setOtherClientSurname, connection, setConnection, additionalComment, setAdditionalComment} = useClientConfirmation(selectedOrders, totalSum, sendingOrder, receiptOrder);

  const initialState = {otherClientName: "",otherClientSurname: "",connection: ""};
  const [errors, setErrors] = useState(initialState);
  const { validateAll } = useValidation(setErrors);
  const { userInfo } = useContext(Context);


  console.log(otherClientName)

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
            telegram_id: userInfo.telegram_id,
            tracking_code: order.tracking_code,
          },
        });
        if (response.data.response.otp_confirmed) {
          const parcel = storedParcels.find(
            (parcel: any) => parcel.trackingNumber == order.tracking_code
          );
          setConfirmationValue(parcel.idOrOtp);
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

  const onConfirm = async () => {
    setLoading(true);
    const isValid = validateAll({ otherClientName, otherClientSurname, connection });

    if (!isValid) {
      setLoading(false); 
      return;
    }
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
              console.log("დადასტურდა აიდით")
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
              setErrorMessage(t("The ID Number does not match the client's ID. Please try again."));
              addParcel(
                order.tracking_code,
                confirmationValue,
                order.client_name,
                "failed"
              );
            }
          } else {
            try {
              console.log("დაიპოსტა აიდით")
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
        }else if(confirmationMethod === "Other"){
          if(otherPersonInfo){
            console.log("გაიცა მე3 პირით იყო სწორი აიდი")
            await confirmDelivery();
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "completed"
            );
            setConfirmationMessage(t("Other person confirmed!"));
            setStartTimer(true);
            await fetchUpdatedOrderList();
          }else{
            await addOtherClient(otherClientName, otherClientSurname)
            await confirmDelivery();
            addParcel(
              order.tracking_code,
              confirmationValue,
              order.client_name,
              "completed"
            );
            setConfirmationMessage(t("Other person posted!"));
            setStartTimer(true);
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


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

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
            {(order.sum != 0 || parseFloat(totalSum) != 0) && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2">
                  {t("Payment Method")}
                </label>
                <select
                  value={paymentMethod ?? ""}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded text-xs"
                >
                  <option value="Cash">{t("Cash")}</option>
                  <option value="bank_card">{t("Bank")}</option>
                </select>
              </div>
            )}

            {sendingOrder && (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-2 text-xs">
                    {t("Confirmation Method")}
                  </label>
                  <select
                    value={confirmationMethod}
                    onChange={(e) =>
                      handleConfirmationMethodChange(e.target.value)
                    }
                    className="w-full p-2 border rounded text-xs"
                  >
                    <option value="OTP">{t("OTP")}</option>
                    <option value="ID Number">{t("ID Number")}</option>
                    <option value="Other">{t("Other Person")}</option>
                  </select>
                </div>

                <div className="mb-4">
                  {confirmationMethod === "OTP" && (
                    <Button
                      onClick={sendOtp} 
                      className="mb-2 bg-blue-500 text-black text-xs"
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
                  <label className="block font-medium mb-2 text-xs">
                    {confirmationMethod === "OTP"
                      ? t("Enter OTP Code")
                      : t("Enter ID Number")}
                  </label>
                  <input
                    type="text"
                    value={confirmationValue}
                    onChange={(e) => setConfirmationValue(e.target.value)}
                    className="w-full p-2 border rounded text-xs"
                    placeholder={
                      confirmationMethod === "OTP"
                        ? t("OTP Code")
                        : t("ID Number")
                    }
                  />
                  {errorMessage && (
                    <div className="text-red-500 text-xs mt-1">{errorMessage}</div>
                  )}
                  {confirmationMethod === "Other" &&(
                    <Button
                      onClick={checkOtherClient}
                      className="mb-2 mt-2 text-xs text-black"
                    >
                     შეამოწმე კლიენტი
                    </Button>   
                  )}
                  {
                    otherPersonInfo && (
                      <ThirdPerson
                      otherClientName={otherClientName}
                      otherClientSurname={otherClientSurname}
                      setOtherClientName={setOtherClientName}
                      setOtherClientSurname={setOtherClientSurname}
                      connection = {connection}
                      additionalComment={additionalComment}
                      setConnection = {setConnection}
                      setAdditionalComment={setAdditionalComment}
                      errors={errors}
                      setErrors={setErrors}
                      otherPersonInfo={otherPersonInfo}
                      />
                    )
                  }
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
