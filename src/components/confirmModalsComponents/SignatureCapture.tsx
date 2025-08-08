import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";

interface Props {
  setSignatureDataUrl: (dataUrl: string | null) => void;
}

const SignatureCapture: React.FC<Props> = ({ setSignatureDataUrl }) => {
  const { t } = useTranslation();
  const signatureCanvasRef = useRef<SignatureCanvas>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 200 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resize canvas with DPI correction
  const updateCanvasSize = () => {
    const padding = 40;
    const screenWidth = window.innerWidth;
    const maxWidth = 500;
    const width = Math.min(screenWidth - padding, maxWidth);
    const height = Math.floor((width * 3) / 5);

    setCanvasSize({ width, height });

    // Fix canvas scaling issue on high DPI screens (like iPhones)
    setTimeout(() => {
      const canvasRef = signatureCanvasRef.current;
      if (!canvasRef) return;

      const canvas = canvasRef.getCanvas();
      const ratio = window.devicePixelRatio || 1;

      // Save existing signature
      const data = canvasRef.toDataURL();

      // Resize canvas
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (context) context.scale(ratio, ratio);

      // Restore signature (optional)
      canvasRef.fromDataURL(data);
    }, 0);
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const clearSignature = () => {
    signatureCanvasRef.current?.clear();
    setSignatureDataUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const saveSignature = () => {
    const canvasRef = signatureCanvasRef.current;
    if (!canvasRef) return;

    if (canvasRef.isEmpty()) {
      setErrorMessage(t("Please provide a signature before saving"));
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);

    const canvas = canvasRef.getCanvas();
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

    let startX = canvas.width,
      startY = canvas.height,
      endX = 0,
      endY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = imgData.data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 0) {
          startX = Math.min(startX, x);
          startY = Math.min(startY, y);
          endX = Math.max(endX, x);
          endY = Math.max(endY, y);
        }
      }
    }

    const trimmedWidth = endX - startX + 1;
    const trimmedHeight = endY - startY + 1;

    const trimmedCanvas = document.createElement("canvas");
    const trimmedContext = trimmedCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!trimmedContext) return;

    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    trimmedContext.putImageData(imgData, -startX, -startY);

    const base64Data = trimmedCanvas.toDataURL("image/png");
    setSignatureDataUrl(base64Data);
    setSuccessMessage(t("Signature saved successfully"));
  };

  return (
    <div>
      <div className="border-2 border-gray-300 rounded-md overflow-hidden mb-2">
        <SignatureCanvas
          ref={signatureCanvasRef}
          backgroundColor="white"
          penColor="black"
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            style: {
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              display: "block",
              touchAction: "none",
            },
          }}
        />
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mb-2">{successMessage}</p>
      )}

      <div className="flex flex-wrap gap-4 justify-between mb-4">
        <button
          onClick={clearSignature}
          className="bg-red-500 text-xs text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          {t("Clear")}
        </button>
        <button
          onClick={saveSignature}
          className="bg-blue-500 text-xs text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default SignatureCapture;
