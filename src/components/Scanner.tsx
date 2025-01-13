import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import {
  GET_DETAILS_BY_SCANNER,
  changeStatusesOfOrder,
} from "../api/Constants";
import { t } from "i18next";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [orderTrackingCodes, setOrderTrackingCodes] = useState<string[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(Context);
  const [manualCode, setManualCode] = useState("");

  const sendGetRequest = async (trackingCode: string) => {
    try {
      setIsLoading(true);

      const requestData = {
        device_id: userInfo.device_id,
        tracking_code: trackingCode,
      };

      const base64Data = btoa(JSON.stringify(requestData));
      const response = await axiosInstance.get(GET_DETAILS_BY_SCANNER, {
        params: { tracking_code_data: base64Data },
      });

      const { status, tracking_codes: trackingCodes } =
        response.data.response.value;

      if (status === "Waiting") {
        const codes = trackingCodes.map(
          (item: { tracking_code: string }) => item.tracking_code
        );
        setOrderTrackingCodes(codes);

        const orderParams = {
          device_id: userInfo.device_id,
          status: "accepted",
          orders: codes,
        };

        await axiosInstance.post(changeStatusesOfOrder, orderParams);
        setFeedbackMessage(t("Scan Successfully"));
      } else {
        const errorMessage =
          status === "Accepted"
            ? t("This reestr is already in tasks")
            : `${t("Unexpected status")}: ${status}`;
        setFeedbackMessage(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching barcode details:", error);
      setFeedbackMessage(t("Failed to fetch details"));
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  const startScanner = () => {
    if (!videoRef.current) return;

    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: { facingMode: "environment" },
      },
      videoRef.current,
      (result) => {
        if (result) {
          const scannedBarcode = result.getText();
          reader.current.reset();
          sendGetRequest(scannedBarcode);
        }
      }
    );
  };

  useEffect(() => {
    startScanner();
    return () => reader.current.reset();
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      sendGetRequest(manualCode.trim());
      setManualCode("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFeedbackMessage(null);
    setOrderTrackingCodes(null);
    startScanner();
  };

  return (
    <div className="relative flex flex-col items-center justify-start h-screen bg-gray-100 pt-24">
      {!isModalOpen && (
        <div className="grid justify-center w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            className="max-h-[480px] w-full rounded-lg shadow-md border border-gray-300"
          />
          <form onSubmit={handleManualSubmit} className="mt-4 w-full">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={t("Enter register code manually")}
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              {t("confirm")}
            </button>
          </form>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {isLoading ? (
              <p className="mb-6 text-gray-700">{t("Loading...")}</p>
            ) : (
              <h2
                className={`text-xl font-bold mb-4 ${
                  feedbackMessage?.includes("Success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {feedbackMessage}
              </h2>
            )}

            {orderTrackingCodes && (
              <p className="text-gray-700">
                {t("Total Parcels in Reestr")}: {orderTrackingCodes.length}
              </p>
            )}

            <button
              onClick={closeModal}
              className="mt-6 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
