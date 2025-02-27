import { useState } from "react";

const useOrder = (selectedOrdersList: { tracking_code: string; sum: number }[]) => {
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});

  // Handle checkbox selection
  const handleCheckboxChange = (tracking_code: string) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [tracking_code]: !prev[tracking_code],
    }));
  };

  // Calculate total sum of checked orders
  const totalSum = selectedOrdersList
    .filter((order) => selectedOrders[order.tracking_code])
    .reduce((sum, order) => sum + order.sum, 0).toFixed(2);

  const totalQuantity = selectedOrdersList.filter((order) => selectedOrders[order.tracking_code]).length;

  return {
    selectedOrders,
    setSelectedOrders,
    totalSum,
    totalQuantity,
    handleCheckboxChange,
  };
};

export default useOrder;
