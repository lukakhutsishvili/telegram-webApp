import { useState } from "react";
import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";

const BarcodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch media devices
  const { devices } = useMediaDevices({
    constraints: { video: true, audio: false },
  });

  // Select the first available video device
  const deviceId = devices?.find(
    (device) => device.kind === "videoinput"
  )?.deviceId;

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    deviceId, // Use specific device ID for the scanner
    onDecodeResult: (decodedResult) => {
      setResult(decodedResult.getText());
      stop(); // Stop scanning after successful decode
    },
    onError: (err) => {
      console.error("Scanner error:", err);
      setError("An unknown error occurred.");
    },
  });

  return (
    <div style={{ textAlign: "center" }}>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          {result ? (
            <>
              <p>
                Scanned Result: <strong>{result}</strong>
              </p>
              <button onClick={() => window.location.reload()}>
                Scan Again
              </button>
            </>
          ) : (
            <>
              <video ref={ref} style={{ width: "100%", height: "auto" }} />
              {isAvailable ? (
                <button onClick={() => (isOn ? off() : on())}>
                  {isOn ? "Turn off" : "Turn on"} Torch
                </button>
              ) : (
                <strong>Torch is not available on this device.</strong>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BarcodeScanner;
