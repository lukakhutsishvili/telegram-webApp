import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRBarcodeScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 }, 
      aspectRatio: 1.0, 
    };

    const html5QrcodeScanner = new Html5QrcodeScanner("scanner", config, false);

    html5QrcodeScanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        html5QrcodeScanner.clear(); 
      },
      (error) => {
        setErrorMessage(error || "Scanning failed");
      }
    );

    return () => {
      html5QrcodeScanner.clear().catch((err) => console.error("Cleanup error:", err));
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
