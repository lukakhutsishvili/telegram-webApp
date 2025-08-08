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
  const [trimmedDataUrl, setTrimmedDataUrl] = useState<string | null>(null);

  const clearSignature = () => {
    signatureCanvasRef.current?.clear();
    setSignatureDataUrl(null);
    setTrimmedDataUrl(null);
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

    setErrorMessage(null); // Clear any existing error

    // Trim the canvas using getTrimmedCanvas
    const trimmedCanvas = canvasRef.getTrimmedCanvas();
    const base64Data = trimmedCanvas.toDataURL("image/png");

    setTrimmedDataUrl(base64Data);
    setSignatureDataUrl(base64Data);
    setSuccessMessage(t("Signature saved successfully"));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden w-full h-[300px] mb-4">
        <SignatureCanvas
          ref={signatureCanvasRef}
          backgroundColor="white"
          penColor="black"
          canvasProps={{
            className: "w-full h-full",
          }}
        />
      </div>

      {errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}

      <div className="flex justify-between gap-4 mb-6">
        <button
          onClick={clearSignature}
          className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm"
        >
          {t("Clear")}
        </button>
        <button
          onClick={saveSignature}
          className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm"
        >
          {t("Save")}
        </button>
      </div>

    </div>
  );
};

export default SignatureCapture;
