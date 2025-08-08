import { useContext, useEffect, useState } from "react";
import { CHECK_OTP_CONFIRMATION } from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import useClientConfirmation from "../hooks/confirm modal hooks/useClientConfirmation";
import useRequestLogs from "../hooks/useRequestLogs";
import ThirdPerson from "./confirmModalsComponents/ThirdPerson";
import { Context } from "../App";
import CustomDropdown from "./CustomDropDown";
import ModalHeader from "./confirmModalsComponents/ModalHeader";
import ConfirmationMessageBox from "./confirmModalsComponents/ConfirmationMessageBox";
import PaymentMethodSelector from "./confirmModalsComponents/PaymentMethodSelector";
import ConfirmationMethodSelector from "./confirmModalsComponents/ConfirmationMethodSelector";
import OtpOrIdInput from "./confirmModalsComponents/OtpOrIdInput";
import FooterButtons from "./confirmModalsComponents/FooterButtons";
import SignatureCapture from "./confirmModalsComponents/SignatureCapture";
import ReturnDeclineModal from "./returnDeclineModal";
import SignatureThirdPerson from "./confirmModalsComponents/SignatureThirdPerson";

interface ConfirmModalProps {
  closeModal: () => void;
  receiptOrder: any;
  sendingOrder: any;
  selectedOrders: { [key: string]: boolean };
  totalSum: string;
  selectedOrdersList: {
    tracking_code: string;
    sum: number;
    places?: { tracking_code: string }[];
  }[];
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  closeModal,
  receiptOrder,
  selectedOrders,
  sendingOrder,
  totalSum,
  selectedOrdersList,
}) => {
  const navigate = useNavigate();
  const PARCELS_KEY = "parcels";
  const storedParcels = JSON.parse(localStorage.getItem(PARCELS_KEY) || "[]");
  const order = sendingOrder || receiptOrder;
  const [returnOrder, setReturnOrder] = useState<string>("");

  const { userInfo } = useContext(Context);
  const [returnedParcelError, setReturnedParcelError] = useState("");

  const [returnDeclineModalOpen, setReturnDeclineModalOpen] = useState(false);

  const PARCEL_WITH_RETURN = order.parcel_with_return;
  const PARCEL_WITHOUT_RETURN_BARCODE = order.parcel_with_return_barcode == "";

  useEffect(() => {
    if (PARCEL_WITHOUT_RETURN_BARCODE) {
      setReturnOrder("no");
    }
  }, [PARCEL_WITHOUT_RETURN_BARCODE]);

  const { addParcel } = useRequestLogs();

  const {
    paymentMethod,
    setPaymentMethod,
    confirmationMethod,
    confirmationValue,
    setConfirmationValue,
    otpSent,
    isOtpSending,
    otpCooldown,
    setOtpCooldown,
    confirmationMessage,
    errorMessage,
    timer,
    setTimer,
    startTimer,
    loading,
    handleConfirmationMethodChange,
    sendOtp,
    confirmDelivery,
    setLoading,
    postClientID,
    setConfirmationMessage,
    setStartTimer,
    fetchUpdatedOrderList,
    checkClientOtp,
    setErrorMessage,
    checkOtherClient,
    addOtherClient,
    otherPersonInfo,
    otherClientName,
    otherClientSurname,
    setOtherClientName,
    setOtherClientSurname,
    connection,
    setConnection,
    additionalComment,
    setAdditionalComment,
    openThirdPersonModal,
    returnedParcel,
    setSelectedReturnReason,
    setSelectedReturnReasonText,
    selectedReturnReason,
    selectedReturnReasonText,
    setSignatureDataUrl,
    signatureDataUrl,
    setSignatureThirdPersonName,
    setSignatureThirdPersonSurname,
    signatureThirdPersonName,
    signatureThirdPersonSurname,
    isThirdPersonOnSignature,
    setIsThirdPersonOnSignature,
  } = useClientConfirmation(
    selectedOrders,
    totalSum,
    sendingOrder,
    receiptOrder,
    selectedOrdersList,
    returnOrder
  );
  const initialState = {
    otherClientName: "",
    otherClientSurname: "",
    connection: "",
    additionalComment,
  };
  const [errors, setErrors] = useState(initialState);
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
    setReturnedParcelError("");
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
      } else if (returnedParcel == true && returnOrder == "") {
        setReturnedParcelError(
          t("Please select if the parcel is returnable or not.")
        );
        return;
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
          console.log(error);
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
      } else if (confirmationMethod === "Other") {
        if (otherPersonInfo) {
          if (errors.connection !== "" || errors.additionalComment !== "") {
            setErrorMessage(t("Input relationship type"));
            return;
          }
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
        } else {
          await addOtherClient(otherClientName, otherClientSurname);
          if (errors.connection !== "" || errors.additionalComment !== "") {
            setErrorMessage(t("Input relationship type"));
            return;
          }
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
      } else if (confirmationMethod === "Signature") {
        if (!signatureDataUrl) {
          setErrorMessage(t("Please provide a signature"));
          return;
        }
        await confirmDelivery();
        addParcel(
          order.tracking_code,
          signatureDataUrl ? "ხელმოწერა" : confirmationValue,
          order.client_name,
          "completed"
        );
        setConfirmationMessage(t("signature posted!"));
        setStartTimer(true);
        await fetchUpdatedOrderList();
        console.log(signatureDataUrl);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage(t("An error occurred while verifying the signature"));
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
        <ModalHeader sendingOrder={!!sendingOrder} />

        {confirmationMessage ? (
          <ConfirmationMessageBox
            confirmationMessage={confirmationMessage}
            timer={timer}
          />
        ) : (
          <>
            {(order.sum != 0 || parseFloat(totalSum) != 0) && (
              <PaymentMethodSelector
                paymentMethod={paymentMethod ?? ""}
                setPaymentMethod={setPaymentMethod}
              />
            )}

            {sendingOrder && (
              <>
                <ConfirmationMethodSelector
                  confirmationMethod={confirmationMethod}
                  onChange={handleConfirmationMethodChange}
                />

                <OtpOrIdInput
                  confirmationMethod={confirmationMethod}
                  confirmationValue={confirmationValue}
                  setConfirmationValue={setConfirmationValue}
                  errorMessage={errorMessage}
                  sendOtp={sendOtp}
                  otpCooldown={otpCooldown}
                  isOtpSending={isOtpSending}
                  otpSent={otpSent}
                  checkOtherClient={checkOtherClient}
                />

                {openThirdPersonModal && (
                  <ThirdPerson
                    otherClientName={otherClientName}
                    otherClientSurname={otherClientSurname}
                    setOtherClientName={setOtherClientName}
                    setOtherClientSurname={setOtherClientSurname}
                    connection={connection}
                    additionalComment={additionalComment}
                    setConnection={setConnection}
                    setAdditionalComment={setAdditionalComment}
                    errors={errors}
                    setErrors={setErrors}
                    otherPersonInfo={otherPersonInfo}
                  />
                )}

                {confirmationMethod === "Signature" && (
                  <>
                    <SignatureThirdPerson
                      setSignatureThirdPersonName={setSignatureThirdPersonName}
                      setSignatureThirdPersonSurname={
                        setSignatureThirdPersonSurname
                      }
                      signatureThirdPersonName={signatureThirdPersonName}
                      signatureThirdPersonSurname={signatureThirdPersonSurname}
                      isThirdPersonOnSignature={isThirdPersonOnSignature}
                      setIsThirdPersonOnSignature={setIsThirdPersonOnSignature}
                    />
                    <SignatureCapture
                      setSignatureDataUrl={setSignatureDataUrl}
                    />
                  </>
                )}

                {PARCEL_WITH_RETURN && !PARCEL_WITHOUT_RETURN_BARCODE && (
                  <CustomDropdown
                    returnOrder={returnOrder}
                    setReturnOrder={setReturnOrder}
                    returnedParcelError={returnedParcelError}
                    setReturnDeclineModalOpen={setReturnDeclineModalOpen}
                    setSelectedReturnReason={setSelectedReturnReason}
                    setSelectedReturnReasonText={setSelectedReturnReasonText}
                  />
                )}

                {returnDeclineModalOpen && (
                  <ReturnDeclineModal
                    setReturnDeclineModalOpen={setReturnDeclineModalOpen}
                    selectedReturnReason={selectedReturnReason}
                    setSelectedReturnReason={setSelectedReturnReason}
                    selectedReturnReasonText={selectedReturnReasonText}
                    setSelectedReturnReasonText={setSelectedReturnReasonText}
                    setReturnOrder={setReturnOrder}
                  />
                )}
              </>
            )}
          </>
        )}

        <FooterButtons
          confirmationMessage={confirmationMessage}
          navigationfunction={navigationfunction}
          closeModal={closeModal}
          onConfirm={onConfirm}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ConfirmModal;
