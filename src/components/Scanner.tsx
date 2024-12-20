import { useZxing } from "react-zxing";
import { useState, useContext } from "react";
import { Context } from "../App";
import { GET_DETAILS_BY_SCANNER } from "../api/Constants";
import { axiosInstance } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useContext(Context);
  const navigate = useNavigate();

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult: (decodedResult) => {
      if (!result) {
        const scannedText = decodedResult.getText();
        setResult(scannedText);
        setIsScanning(false);
        stopCamera();
        if (isOn) off();
        sendGetRequest(scannedText);
      }
    },
  });

  const stopCamera = () => {
    const videoElement = ref.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  };

  const sendGetRequest = async (trackingCode: string) => {
    try {
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

      console.log("API Response:", response.data);
      setResponseData(response.data);
      setError(null);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Error fetching details:", error);
      let errorMessage = "An error occurred";
      if (error.response && error.response.data) {
        if (error.response.data.response) {
          errorMessage = error.response.data.response;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      errorMessage = errorMessage + (error.response?.data || "");
      setError(errorMessage);
      setResponseData(null);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/home");
  };

  return (
    <div className="flex flex-col">
      {isScanning ? (
        <div className="flex-1 bg-black flex justify-center items-center h-[50vh] relative">
          <video ref={ref} className="w-full h-full object-cover" />
          {isAvailable && (
            <button
              onClick={() => (isOn ? off() : on())}
              className="absolute bottom-10 bg-blue-500 text-white py-2 px-4 rounded-md z-10"
            >
              {isOn ? "Turn off" : "Turn on"} torch
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center h-screen">
          <div>
            <p className="text-lg font-bold">Scanned Result: {result}</p>
            {responseData && (
              <div>
                <h3 className="text-xl font-semibold">Response Data:</h3>
                <pre className="bg-gray-100 p-4 rounded-md mt-2">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center max-w-md w-full">
            <h3 className="text-xl font-semibold">
              {responseData ? "API Response" : "Error"}
            </h3>
            <pre className="bg-gray-100 p-4 rounded-md mt-4 text-sm">
              {responseData
                ? JSON.stringify(responseData, null, 2)
                : error || "An error occurred"}
            </pre>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BarcodeScanner;
