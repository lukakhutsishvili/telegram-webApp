import { t } from "i18next";

interface ComponentParcelErrorProps {
  closeComponentParcelErrorModal: () => void; // function returning void
}

function ComponentParcelError({
  closeComponentParcelErrorModal,
}: ComponentParcelErrorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
      <p className="text-white mb-4">{t("please scan all order")}</p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={closeComponentParcelErrorModal}
      >
        {t("close")}
      </button>
    </div>
  );
}

export default ComponentParcelError;
