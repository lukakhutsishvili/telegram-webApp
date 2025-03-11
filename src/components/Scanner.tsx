import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { axiosInstance } from "../api/apiClient";
import { Context } from "../App";
import {
  GET_DETAILS_BY_SCANNER,
  ORDER_LIST,
  changeStatusesOfOrder,
} from "../api/Constants";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

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
  const { setRecieptTasks, setSendingTasks } = useContext(Context);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const navigate = useNavigate();
  const { sendingTasks, recieptTasks } = useContext(Context);

  const activeStatus = "Accepted";

  const handleConfirmAllTasks = (trackingCode: string) => {
    const task =
      sendingTasks.find((task) => task.tracking_code === trackingCode) ||
      recieptTasks.find((task) => task.tracking_code === trackingCode);

    if (!task) {
      console.warn(`Order with tracking code ${trackingCode} not found`);
      return;
    }

    // Use the selected order's address as the main address
    const mainAddress = task.client_address;

    // Find all orders with the same phone number and status
    const samePhoneTasks = [...sendingTasks, ...recieptTasks].filter(
      (order) =>
        order.client_phone === task.client_phone &&
        order.Status === activeStatus
    );

    // Separate same-address and different-address orders
    const sameAddressOrders = samePhoneTasks.filter(
      (order) =>
        order.client_address === mainAddress &&
        order.tracking_code !== trackingCode
    );
    const differentAddressOrders = samePhoneTasks.filter(
      (order) => order.client_address !== mainAddress
    );

    // Ensure the selected order is first in the array
    const selectedOrdersList = [
      task,
      ...sameAddressOrders,
      ...differentAddressOrders,
    ];
    const newPath = window.location.pathname.replace("/scanner", "");
    navigate(`${newPath}/order/${trackingCode}`, {
      state: {
        selectedOrdersList,
        differentAddressOrders,
      },
    });
  };

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
        handleConfirmAllTasks(firstResponseData.tracking_code);
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      sendGetRequest(manualCode.trim());
      setManualCode("");
    }
  };

  const fetchRecieptTasks = async () => {
    try {
      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(
            JSON.stringify({
              device_id: userInfo.device_id,
              pickup_task: true,
              status: ["Waiting", "Accepted", "Completed", "Canceled"],
            })
          ),
        },
      });
      setRecieptTasks(response.data.response);
    } catch (error) {
      console.error("Error fetching receipt tasks:", error);
    }
  };

  // Fetch sending tasks
  const fetchSendingTasks = async () => {
    try {
      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(
            JSON.stringify({
              device_id: userInfo.device_id,
              pickup_task: false,
              status: ["Waiting", "Accepted", "Completed", "Canceled"],
            })
          ),
        },
      });
      setSendingTasks(response.data.response);
    } catch (error) {
      console.error("Error fetching sending tasks:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-start h-screen bg-gray-100 pt-24 h-sm:pt-16">
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
              <div className="flex justify-center items-center mb-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : secRes && secRes.status ? (
              <div>
                <h2 className="text-xl font-bold mb-4 text-green-600">
                  {t("Scan Successfully")}
                </h2>
                <p className="text-gray-700">
                  {t("Total Parcels in Register")}: {orderTrackingCodes.length}
                </p>
              </div>
            ) : orderTrackingCodes && orderTrackingCodes.error ? (
              <h2 className="text-xl font-bold mb-4 text-red-600">
                {orderTrackingCodes.error}
              </h2>
            ) : (
              <p className="mb-6 text-gray-700">{t("No details available")}</p>
            )}

            <button
              onClick={async () => {
                setIsFetchingTasks(true); // Start spinner
                try {
                  await fetchSendingTasks(); // Fetch sending tasks first
                  await fetchRecieptTasks(); // Then fetch receipt tasks
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

export default BarcodeScanner;
