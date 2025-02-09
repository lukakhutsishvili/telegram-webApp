function RequestLog() {
    const storedParcelData = JSON.parse(localStorage.getItem("parcels") || "[]");
  
    return (
      <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 
      w-full min-h-screen  p-6">
        <div className="flex items-center mb-6">
            <button
            onClick={() => window.history.back()}
            className="text-gray-500 text-4xl mr-4"
            >
            <span>&larr;</span>
            </button>
            <h1 className="text-2xl font-bold text-black text-center">
            📦 Order Logs
            </h1>
        </div>
          
        <div className="w-full max-w-4xl bg-white/90 shadow-lg rounded-xl p-3">
          <div className="flex flex-col gap-1">
            {storedParcelData.length > 0 ? (
              storedParcelData.map((parcel: any, index: number) => (
                <div
                  key={index}
                  className={`bg-white p-2 rounded-lg shadow-md border-2 ${ parcel.status == "failed"? "border-red-700" : "border-green-400" }`}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between text-sm font-medium">
                      <p className="text-gray-700">👤 Client:</p>
                      <p className="text-gray-900">{parcel.clientName}</p>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <p className="text-gray-700">📦 Tracking Number:</p>
                      <p className="text-gray-900">{parcel.trackingNumber}</p>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <p className="text-gray-700">🔑 ID/OTP:</p>
                      <p className="text-gray-900">{parcel.idOrOtp}</p>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      ⏳ {new Date(parcel.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-lg">
                🚫 No parcel data available.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default RequestLog;
  