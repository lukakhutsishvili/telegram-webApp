import { useZxing } from "react-zxing";
import { useState, useEffect, useRef } from "react";

const BarcodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const hasLoggedResult = useRef(false); // Track if result has been logged

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult: (decodedResult) => {
      if (!result) {
        // Stop processing further results once a barcode is read
        setResult(decodedResult.getText()); // Capture scanned result
        setIsScanning(false); // Stop scanning
        stopCamera(); // Stop the camera
        if (isOn) off(); // Turn off the torch if it is on
      }
    },
  });

  const stopCamera = () => {
    const videoElement = ref.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop()); // Stop all media tracks
      videoElement.srcObject = null; // Clear the video source
    }
  };

  useEffect(() => {
    if (result && !hasLoggedResult.current) {
      console.log("Scanned Result:", result); // Log result once
      hasLoggedResult.current = true; // Mark as logged
    }
  }, [result]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "50vh" }}>
      {isScanning ? (
        <div
          style={{
            flex: 1,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
          }}
        >
          <p>Scanned Result: {result}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
