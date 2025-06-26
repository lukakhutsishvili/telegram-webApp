import React, { useState } from "react";
import { t } from "i18next";

interface ReturnDeclineModalProps {
  onClose: () => void;
  onSubmit: (comment1: string, comment2: string) => void;
}

const ReturnDeclineModal: React.FC<ReturnDeclineModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [comment1, setComment1] = useState("");
  const [comment2, setComment2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!comment1.trim() || !comment2.trim()) {
      setError(t("Both comment fields are required."));
      return;
    }

    setError("");
    onSubmit(comment1, comment2);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {t("Return Declined - Provide Explanation")}
        </h2>

        <textarea
          className="w-full border p-2 mb-3 rounded text-sm"
          placeholder={t("Enter first commentary")}
          value={comment1}
          onChange={(e) => setComment1(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3 rounded text-sm"
          placeholder={t("Enter second commentary")}
          value={comment2}
          onChange={(e) => setComment2(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            {t("Submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnDeclineModal;
