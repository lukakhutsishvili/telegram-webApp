import { useZxing } from "react-zxing";
import { useState } from "react";

const BarcodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult: (decodedResult) => {
      setResult(decodedResult.getText()); // Capture scanned result
      setIsScanning(false); // Stop scanning
    },
  });

  return (
    <>
      {isScanning ? (
        <>
          <video ref={ref} />
          {isAvailable ? (
            <button onClick={() => (isOn ? off() : on())}>
              {isOn ? "Turn off" : "Turn on"} torch
            </button>
          ) : (
            <strong>
              Unfortunately, torch is not available on this device.
            </strong>
          )}
        </>
      ) : (
        <p>Scanned Result: {result}</p>
      )}
    </>
  );
};

export default BarcodeScanner;
