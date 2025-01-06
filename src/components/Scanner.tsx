import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import {
  GET_DETAILS_BY_SCANNER,
  changeStatusesOfOrder,
} from "../api/Constants";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTrackingCodes, setOrderTrackingCodes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false);
  const { userInfo } = useContext(Context);
  const [secRes, setSecRes] = useState<any>();

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

      const response = await axiosInstance.get(GET_DETAILS_BY_SCANNER, {
        params,
      });

      const trackingCodes = response.data.response.value.tracking_codes.map(
        (item: { tracking_code: string }) => item.tracking_code
      );

      setOrderTrackingCodes(trackingCodes);
      setIsConfirmationRequired(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching barcode details:", error);
      setOrderTrackingCodes({ error: "Failed to fetch details" });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSecondRequest = async () => {
    try {
      setIsLoading(true);

      const orderParams = {
        device_id: userInfo.device_id,
        status: "accepted",
        orders: orderTrackingCodes,
      };

      const secResponse = await axiosInstance.post(
        changeStatusesOfOrder,
        orderParams
      );
      setSecRes(secResponse);
      setIsConfirmationRequired(false);
    } catch (error) {
      console.error("Error updating order status:", error);
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
  }, []);

  return (
    <div className="relative">
      {!isModalOpen && <video ref={videoRef} className="w-full h-100vh" />}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {isLoading ? (
              <p className="mb-6 text-gray-700">Loading...</p>
            ) : isConfirmationRequired ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-blue-600">
                  Confirm Re-entry
                </h2>
                <p className="mb-6 text-gray-700">
                  Do you want to accept the re-entry for the scanned order?
                </p>
                <button
                  onClick={sendSecondRequest}
                  className="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                >
                  No
                </button>
              </>
            ) : secRes && secRes.status ? (
              <h2 className="text-xl font-bold mb-4 text-green-600">
                Scan Successful!
              </h2>
            ) : orderTrackingCodes && orderTrackingCodes.error ? (
              <h2 className="text-xl font-bold mb-4 text-red-600">
                {orderTrackingCodes.error}
              </h2>
            ) : (
              <p className="mb-6 text-gray-700">No details available</p>
            )}
            {!isConfirmationRequired && (
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
