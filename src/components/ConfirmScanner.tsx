import { useState, useRef, useEffect, useContext } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Context } from "../App";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import useOrder from "../hooks/order page hooks/useOrder";

interface ConfimParcelScannerProps {
  selectedOrdersList: { tracking_code: string; sum: number }[];
}

const ConfimParcelScanner: React.FC<ConfimParcelScannerProps> = ({
  selectedOrdersList,
}) => {
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

  const { setSelectedOrderManually } = useOrder(selectedOrdersList || []);

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
          console.log(scannedBarcode);

          // Find if the scanned barcode exists in selectedOrdersList
          const foundOrder = selectedOrdersList.find(
            (order) => order.tracking_code === scannedBarcode
          );

          if (foundOrder) {
            setSelectedOrderManually(scannedBarcode); // Mark the order as selected
          }

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
      setManualCode("");
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

export default ConfimParcelScanner;
