import { useState, useEffect, useContext } from "react";
import { Context } from "../../App";
import { GET_RELATIONSHIPS } from "../../api/Constants";
import { axiosInstance } from "../../api/apiClient";

const useRelationships = (autoFetch: boolean = true) => {
  const { userInfo } = useContext(Context);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRelationships = async () => {
    if (!userInfo?.device_id) {
      console.warn("Device ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    const params = {
      device_id: userInfo.device_id,
    };

    try {
      const response = await axiosInstance.get(GET_RELATIONSHIPS, { params });
      setData(response.data);
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

  return { data, loading, error, getRelationships };
};

export default useRelationships;
