import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";

interface Props {
  setSignatureDataUrl: (dataUrl: string | null) => void;
}

const SignatureCapture: React.FC<Props> = ({ setSignatureDataUrl }) => {
  const { t } = useTranslation();
  const signatureCanvasRef = useRef<SignatureCanvas>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearSignature = () => {
    signatureCanvasRef.current?.clear();
    setSignatureDataUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const trimCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return canvas;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const l = pixels.data.length;

    let minX = canvas.width,
      minY = canvas.height,
      maxX = 0,
      maxY = 0;

    for (let i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        const x = (i / 4) % canvas.width;
        const y = ~~(i / 4 / canvas.width);

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    const w = maxX - minX;
    const h = maxY - minY;
    const trimmed = document.createElement("canvas");
    const tCtx = trimmed.getContext("2d", { willReadFrequently: true });

    trimmed.width = w;
    trimmed.height = h;

    if (tCtx) {
      tCtx.putImageData(ctx.getImageData(minX, minY, w, h), 0, 0);
    }

    return trimmed;
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

    // ✅ use custom trim function instead of getTrimmedCanvas()
    const rawCanvas = canvasRef.getCanvas();
    const trimmedCanvas = trimCanvas(rawCanvas);
    const base64Data = trimmedCanvas.toDataURL("image/png");

    setSignatureDataUrl(base64Data);
    setSuccessMessage(t("Signature saved successfully"));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden w-full h-[200px] mb-4">
        <SignatureCanvas
          ref={signatureCanvasRef}
          backgroundColor="white"
          penColor="black"
          canvasProps={{
            className: "w-full h-full",
          }}
        />
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mb-2">{successMessage}</p>
      )}

      <div className="flex justify-between gap-4 mb-6">
        <button
          onClick={clearSignature}
          className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-xs"
        >
          {t("Clear")}
        </button>
        <button
          onClick={saveSignature}
          className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-xs"
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default SignatureCapture;
