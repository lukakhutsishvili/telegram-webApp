import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { t } from "i18next";

interface ConfimParcelScannerProps {
  selectedOrdersList: { tracking_code: string; sum: number }[];
  selectedOrders: { [key: string]: boolean };
  setSelectedOrders: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfimParcelScanner: React.FC<ConfimParcelScannerProps> = ({selectedOrdersList,setSelectedOrders,setIsScanning,}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [restart, setRestart] = useState(false);

  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

          // Find the scanned parcel in the list
          const foundOrder = selectedOrdersList.find(
            (order) => order.tracking_code === scannedBarcode
          );

          if (foundOrder) {
            // Mark the scanned order as selected
            setSelectedOrders((prev) => ({
              ...prev,
              [scannedBarcode]: true,
            }));
            setSuccessMessage(t("Success! Parcel processed."));
          } else {
            // Show modal with error message if parcel not found
            setSuccessMessage(t("No parcel found"));
          }
          // Open the modal and restart scanner in both cases
          setIsModalOpen(true);
          setRestart(!restart);
        }
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [restart, selectedOrdersList, setSelectedOrders]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      const scannedBarcode = manualCode.trim();
      setManualCode("");

      // Find the manually entered parcel in the list
      const foundOrder = selectedOrdersList.find(
        (order) => order.tracking_code === scannedBarcode
      );

      if (foundOrder) {
        // Mark the manually entered order as selected
        setSelectedOrders((prev) => ({
          ...prev,
          [scannedBarcode]: true,
        }));
        setSuccessMessage(t("Success! Parcel processed."));
      } else {
        // Show modal with error message if parcel not found
        setSuccessMessage(t("No parcel found"));
      }
      setIsModalOpen(true);
      setRestart(!restart);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-start h-screen bg-gray-100 pt-24 h-sm:pt-16">
      <button
        className="px-3 absolute top-0 right-0 py-1 bg-yellow-500 text-gray-600 hover:bg-gray-200 rounded-full shadow-sm transition duration-200 ease-in-out"
        onClick={() => {
          setIsScanning(false);
        }}
      >
        ✕
      </button>
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
            {successMessage ? (
              <p className="mb-6 text-green-700">{successMessage}</p>
            ) : (
              <p className="mb-6 text-gray-700">{t("No details available")}</p>
            )}

            <button
              onClick={async () => {
                setIsFetchingTasks(true); // Start spinner
                try {
                  // Execute your async operation here
                  // For example: await fetchTasks();
                  // On success, set a success message:
                  setSuccessMessage(t("Success! Parcel processed."));
                } catch (error) {
                  console.error("Error fetching tasks:", error);
                } finally {
                  setIsFetchingTasks(false); // Stop spinner
                  // Display the success message for 2 seconds before closing the modal and restarting the scanner
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
