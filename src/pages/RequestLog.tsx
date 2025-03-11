import { useTranslation } from "react-i18next";
import useRequestLogs from "../hooks/useRequestLogs";

function RequestLog() {
  const { t } = useTranslation();
  const { parcels: orderLogs } = useRequestLogs();

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 
      w-full min-h-screen px-6 pt-24 pb-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-black text-4xl mr-4"
        >
          <span>&larr;</span>
        </button>
        <h1 className="text-base font-bold text-black text-center">
          {t("orderLogs.title")}
        </h1>
      </div>

      {/* Logs Container */}
      <div className="w-full max-w-4xl bg-white/90 shadow-lg rounded-xl p-2">
        <div className="flex flex-col gap-1">
          {orderLogs.length > 0 ? (
            [...orderLogs].reverse().map((parcel, index) => (
              <div
                key={index}
                className={`bg-white p-1 rounded-lg shadow-md border-2 transition-all hover:scale-105
                ${parcel.status === "failed" ? "border-red-700" : "border-green-400"}`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs font-medium">
                    <p className="text-gray-700">{t("orderLogs.client")}:</p>
                    <p className="text-gray-900">{parcel.clientName}</p>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <p className="text-gray-700">{t("orderLogs.trackingNumber")}:</p>
                    <p className="text-gray-900">{parcel.trackingNumber}</p>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <p className="text-gray-700">{t("orderLogs.idOtp")}:</p>
                    <p className="text-gray-900">{parcel.idOrOtp}</p>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    ⏳ {parcel.timestamp ? new Date(parcel.timestamp).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg">
              {t("orderLogs.noData")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestLog;
