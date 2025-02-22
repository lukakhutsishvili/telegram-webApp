import { useState, useEffect } from "react";

const PARCELS_KEY = "parcels";

interface Parcel {
  trackingNumber: string;
  idOrOtp: string;
  clientName: string;
  status: "completed" | "failed";
  timestamp: string;
}

const useRequestLogs = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);

  useEffect(() => {
    const storedParcels = JSON.parse(localStorage.getItem(PARCELS_KEY) || "[]");
    setParcels(storedParcels);
  }, []);

  const addParcel = (trackingNumber: string, idOrOtp: string, clientName: string, status: "completed" | "failed") => {
    const newParcel: Parcel = {
      trackingNumber,
      idOrOtp,
      clientName,
      status,
      timestamp: new Date().toISOString(),
    };

    setParcels((prevParcels) => {
      const updatedParcels = [...prevParcels, newParcel];
      localStorage.setItem(PARCELS_KEY, JSON.stringify(updatedParcels));
      return updatedParcels;
    });
  };

  // Function to clear all parcels from local storage and state
  const clearLogs = () => {
    localStorage.removeItem(PARCELS_KEY);
    setParcels([]);
  };

  return { parcels, addParcel, clearLogs };
};

export default useRequestLogs;
