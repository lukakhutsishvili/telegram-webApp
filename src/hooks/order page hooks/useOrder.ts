import { useState, useEffect } from "react";

const useOrder = (selectedOrdersList: { tracking_code: string; sum: number }[]) => {
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});

  // Initialize selectedOrders state with all tracking codes set to false
  useEffect(() => {
    const initialSelection: { [key: string]: boolean } = {};
    selectedOrdersList.forEach((order, index) => {
      initialSelection[order.tracking_code] = index === 0; // First parcel is true
    });
    setSelectedOrders(initialSelection);
  }, []);

  console.log(selectedOrders)
  // Handle checkbox selection
  const handleCheckboxChange = (tracking_code: string) => {
    setSelectedOrders(prev => ({
      ...prev,
      [tracking_code]: !prev[tracking_code],
    }));
  };

  // Calculate total sum of checked orders
  const totalSum = selectedOrdersList
    .filter(order => selectedOrders[order.tracking_code])
    .reduce((sum, order) => sum + order.sum, 0)
    .toFixed(2);

  const totalQuantity = selectedOrdersList.filter(order => selectedOrders[order.tracking_code]).length;

  return {
    selectedOrders,
    setSelectedOrders,
    totalSum,
    totalQuantity,
    handleCheckboxChange,
  };
};

export default useOrder;
