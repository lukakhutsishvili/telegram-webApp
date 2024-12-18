import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRBarcodeScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const config = {
      fps: 15,
      qrbox: window.innerWidth < 420 ? { width: 200, height: 200 } : { width: 250, height: 250 },
      aspectRatio: 1.0,
      facingMode: { exact: "environment" },
    };

    const html5QrcodeScanner = new Html5QrcodeScanner("scanner", config, false);

    html5QrcodeScanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        setErrorMessage(null);
      },
      (error: unknown) => {
        // Type guard to ensure error is an object with name/message
        if (typeof error === "object" && error !== null && "name" in error && "message" in error) {
          const err = error as Error;
          setErrorMessage(`Error (${err.name}): ${err.message}`);
        } else {
          setErrorMessage("An unknown error occurred during scanning.");
        }
      }
    );

    return () => {
      html5QrcodeScanner.clear().catch((err) =>
        console.error("Cleanup error:", err)
      );
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>QR/Barcode Scanner</h2>
      <div id="scanner" style={{ width: "100%", marginBottom: "20px" }}></div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>Scanned Data: {scannedData || "No result yet"}</p>
    </div>
  );
};

export default QRBarcodeScanner;
