import { useZxing } from "react-zxing";
import { useState, useEffect, useRef, useContext } from "react";
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
  const hasLoggedResult = useRef(false);
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
      console.log(error);
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

  useEffect(() => {
    if (result && !hasLoggedResult.current) {
      console.log("Scanned Result:", result);
      hasLoggedResult.current = true;
    }
  }, [result]);

  console.log(userInfo.device_id);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/home");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isScanning ? (
        <div
          style={{
            flex: 1,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <video
            ref={ref}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {isAvailable && (
            <button
              onClick={() => (isOn ? off() : on())}
              style={{ position: "absolute", bottom: "10px", zIndex: 1 }}
            >
              {isOn ? "Turn off" : "Turn on"} torch
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <p>Scanned Result: {result}</p>
            {responseData && (
              <div>
                <h3>Response Data:</h3>
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h3>{responseData ? "API Response" : "Error"}</h3>
            <pre>
              {responseData
                ? JSON.stringify(responseData, null, 2)
                : error || "An error occurred"}
            </pre>
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
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
