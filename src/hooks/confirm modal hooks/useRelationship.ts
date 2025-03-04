import { useState, useEffect, useContext } from "react";
import { Context } from "../../App";
import { GET_RELATIONSHIPS } from "../../api/Constants";
import { axiosInstance } from "../../api/apiClient";

const useRelationships = (autoFetch: boolean = true) => {
  const { userInfo } = useContext(Context);
  const [relationshipData, setRelationshipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRelationships = async () => {
    if (!userInfo?.device_id) {
      console.warn("Device ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(GET_RELATIONSHIPS);
      setRelationshipData(response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch relationships");
      console.error("Error fetching relationships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      getRelationships();
    }
  }, [autoFetch]);

  return { relationshipData, loading, error, getRelationships };
};

export default useRelationships;
