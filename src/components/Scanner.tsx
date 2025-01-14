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
  const [orderTrackingCodes, setOrderTrackingCodes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(Context);
  const [secRes, setSecRes] = useState<any>();
  const [manualCode, setManualCode] = useState("");
  const [restart, setRestart] = useState(false);

  const sendGetRequest = async (trackingCode: string) => {
    try {
      setIsLoading(true);
      const requestData = {
        device_id: userInfo.device_id,
        tracking_code: trackingCode,
      };

      const jsonData = JSON.stringify(requestData);
      const base64Data = btoa(jsonData);

      const params = { tracking_code_data: base64Data };

      // First API call
      const response = await axiosInstance.get(GET_DETAILS_BY_SCANNER, {
        params,
      });

      const firstResponseData = response.data.response.value;
      const status = firstResponseData.status;

      if (status === "Waiting") {
        const trackingCodes = firstResponseData.tracking_codes.map(
          (item: { tracking_code: string }) => item.tracking_code
        );

        setOrderTrackingCodes(trackingCodes);

        const orderParams = {
          device_id: userInfo.device_id,
          status: "accepted",
          orders: trackingCodes,
        };

        // Second API call
        const secResponse = await axiosInstance.post(
          changeStatusesOfOrder,
          orderParams
        );

        setSecRes(secResponse);
        setIsModalOpen(true);
      } else if (status === "Accepted") {
        setOrderTrackingCodes({
          error: "This reestr is already in tasks",
        });
        setIsModalOpen(true);
      } else {
        setOrderTrackingCodes({
          error: "Unexpected status: " + status,
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching barcode details:", error);
      setOrderTrackingCodes({ error: "Failed to fetch details" });
      setIsModalOpen(true); // Open modal even on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: "environment",
        },
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

    return () => {
      reader.current.reset();
    };
  }, [restart]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      sendGetRequest(manualCode.trim());
      setManualCode("");
    }
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
            ) : secRes && secRes.status ? (
              <h2 className="text-xl font-bold mb-4 text-green-600">
                {t("Scan Successfully")}
              </h2>
            ) : orderTrackingCodes && orderTrackingCodes.error ? (
              <h2 className="text-xl font-bold mb-4 text-red-600">
                {orderTrackingCodes.error}
              </h2>
            ) : (
              <p className="mb-6 text-gray-700">{t("No details available")}</p>
            )}

            {secRes && secRes.status && orderTrackingCodes?.length > 0 && (
              <p className="text-gray-700">
                {t("Total Parcels in Reestr")}: {orderTrackingCodes.length}
              </p>
            )}

            <button
              onClick={() => {
                setIsModalOpen(false);
                setRestart(!restart);
              }}
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