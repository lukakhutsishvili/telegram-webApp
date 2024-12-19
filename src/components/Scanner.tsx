import { useZxing } from "react-zxing";
import { useState } from "react";

const BarcodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult: (result) => setResult(result.getText()), // Capture scanned result
  });

  return (
    <>
      <video ref={ref} />
      {isAvailable ? (
        <button onClick={() => (isOn ? off() : on())}>
          {isOn ? "Turn off" : "Turn on"} torch
        </button>
      ) : (
        <strong>Unfortunately, torch is not available on this device.</strong>
      )}
      {result && <p>Scanned Result: {result}</p>}
    </>
  );
};

export default BarcodeScanner;
