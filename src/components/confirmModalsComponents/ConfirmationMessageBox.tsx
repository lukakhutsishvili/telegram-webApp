import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  confirmationMessage: string;
  timer: number;
}

const ConfirmationMessageBox: React.FC<Props> = ({ confirmationMessage, timer }) => {
  const { t } = useTranslation();

  if (!confirmationMessage) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-sm">
      <p>{confirmationMessage}</p>
      <p className="mt-1">
        {t("This message will disappear in")} {timer} {t("seconds")}.
      </p>
    </div>
  );
};

export default ConfirmationMessageBox;
