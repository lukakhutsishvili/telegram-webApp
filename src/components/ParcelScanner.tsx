import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import {
  GET_DETAILS_BY_SCANNER,
  changeStatusesOfOrder,
} from "../api/Constants";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const ConfirmParcelScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTrackingCodes, setOrderTrackingCodes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(Context);
  const [secRes, setSecRes] = useState<any>();
  const [manualCode, setManualCode] = useState("");
  const [restart, setRestart] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const navigate = useNavigate();

  const sendGetRequest = async (trackingCode: string) => {
    console.log(trackingCode);
    try {
      setIsLoading(true);
      const requestData = {
        device_id: userInfo.device_id || "6087086146",
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

      if (response.data.response.type == "parcel") {
        const newPath = window.location.pathname.replace("/scanner", "");
        navigate(`${newPath}/order/${firstResponseData.tracking_code}`);
        return;
      }

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
      } else if (status === "Accepted") {
        setOrderTrackingCodes({
          error: "This reestr is already in tasks",
        });
      } else {
        setOrderTrackingCodes({
          error: "Unexpected status: " + status,
        });
      }
    } catch (error) {
      console.error("Error fetching barcode details:", error);
      setOrderTrackingCodes({ error: "Failed to fetch details" });
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
          setIsModalOpen(true);
        }
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [restart]);

  return (
    <div className="relative flex flex-col items-center justify-start h-screen bg-gray-100 pt-24 h-sm:pt-16">
      {!isModalOpen && (
        <div className="grid justify-center w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            className="max-h-[480px] w-full rounded-lg shadow-md border border-gray-300"
          />
          <form className="mt-4 w-full">
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
              <div className="flex justify-center items-center mb-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
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
              onClick={async () => {
                setIsFetchingTasks(true); // Start spinner
                try {
                } catch (error) {
                  console.error("Error fetching tasks:", error);
                } finally {
                  setIsFetchingTasks(false); // Stop spinner
                  setIsModalOpen(false);
                  setRestart(!restart);
                }
              }}
              disabled={isFetchingTasks} // Disable button while fetching tasks
              className={`mt-6 w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isFetchingTasks
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {isFetchingTasks ? (
                <div className="flex justify-center items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">{t("Loading...")}</span>
                </div>
              ) : (
                t("Close")
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmParcelScanner;
