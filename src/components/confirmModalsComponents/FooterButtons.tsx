import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";

interface Props {
  confirmationMessage: string | null;
  navigationfunction: () => void;
  closeModal: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const FooterButtons: React.FC<Props> = ({
  confirmationMessage,
  navigationfunction,
  closeModal,
  onConfirm,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center space-x-4">
      <Button
        onClick={confirmationMessage ? navigationfunction : closeModal}
        className="g-gray-300 text-black"
      >
        {t("cancel")}
      </Button>

      {!confirmationMessage && (
        <Button
          onClick={onConfirm}
          disabled={loading}
          className={`g-gray-300 text-black ${
            loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></div>
              <span className="ml-2">{t("loading")}</span>
            </div>
          ) : (
            t("confirm")
          )}
        </Button>
      )}
    </div>
  );
};

export default FooterButtons;
