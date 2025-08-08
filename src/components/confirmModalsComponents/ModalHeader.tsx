import { useTranslation } from "react-i18next";

const ModalHeader = ({ sendingOrder }: { sendingOrder: boolean }) => {
  const { t } = useTranslation();

  return (
    <h2 className="text-lg font-bold mb-4">
      {sendingOrder ? t("Confirm Handover") : t("Confirm Receiving")}
    </h2>
  );
};

export default ModalHeader;

