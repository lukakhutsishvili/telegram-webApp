import { useState, useEffect, useContext } from "react";
import { Context } from "../../App";
import { GET_RELATIONSHIPS } from "../../api/Constants";
import { axiosInstance } from "../../api/apiClient";

interface Relationship {
  Code: string;
  Description: string;
  Commentary_Required: boolean;
}

const useRelationships = (autoFetch: boolean = true) => {
  const { userInfo } = useContext(Context);
  const [relationshipData, setRelationshipData] = useState<Relationship[]>([]);
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
      setRelationshipData(response.data.response);
      return response.data.response;
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
