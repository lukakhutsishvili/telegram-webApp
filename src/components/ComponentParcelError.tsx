import { t } from "i18next";

interface ComponentParcelErrorProps {
  closeComponentParcelErrorModal: () => void;
}

function ComponentParcelError({
  closeComponentParcelErrorModal,
}: ComponentParcelErrorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("Error")}
        </h2>
        <p className="text-gray-600 mt-2">{t("please scan all order")}</p>
        <button
          className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
          onClick={closeComponentParcelErrorModal}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}

export default ComponentParcelError;
