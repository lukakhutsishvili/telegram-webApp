import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import { GET_DETAILS_BY_SCANNER, changeOrderStatus } from "../api/Constants";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, navbarButtons } = useContext(Context);
  const [secRes, setSecRes] = useState<any>();
  const navigate = useNavigate();

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

      setResponseData(trackingCodes);

      const orderParams = {
        device_id: userInfo.device_id,
        status: "accepted",
        orders: trackingCodes,
      };

      const secResponse = await axiosInstance.post(
        changeOrderStatus,
        orderParams
      );
      setSecRes(secResponse);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching barcode details:", error);
      setResponseData({ error: "Failed to fetch details" });
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
      (result, error) => {
        if (result) {
          const scannedBarcode = result.getText();
          reader.current.reset();
          sendGetRequest(scannedBarcode);
        }
        if (error) console.error(error);
      }
    );

    return () => {
      reader.current.reset();
    };
  }, []);

  return (
    <div className="barcode-scanner relative">
      {!isModalOpen && <video ref={videoRef} className="w-full h-auto" />}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              {responseData && typeof responseData === "object"
                ? responseData.error || "Scan Successful!"
                : responseData}
            </h2>
            {isLoading ? (
              <p className="mb-6 text-gray-700">Loading...</p>
            ) : responseData ? (
              responseData.error ? (
                <p className="mb-6 text-red-500">{responseData.error}</p>
              ) : (
                <div>
                  <p className="mb-4 text-gray-700">Details:</p>
                  <pre className="text-left bg-gray-100 p-4 rounded">
                    {JSON.stringify(secRes, null, 2)}
                  </pre>
                </div>
              )
            ) : (
              <p className="mb-6 text-gray-700">No details available</p>
            )}
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (navbarButtons) {
                  navigate("/" + navbarButtons);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
