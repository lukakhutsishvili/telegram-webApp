import { useState, useEffect, useMemo } from "react";

const useOrder = (selectedOrdersList: { tracking_code: string; sum: number }[]) => {
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});

  // Initialize selectedOrders state with all tracking codes set to false
  useEffect(() => {
    const initialSelection = selectedOrdersList.reduce((acc, order) => {
      acc[order.tracking_code] = false;
      return acc;
    }, {} as { [key: string]: boolean });

    setSelectedOrders(initialSelection);
  }, [selectedOrdersList]);

  // Handle checkbox selection
  const handleCheckboxChange = (tracking_code: string) => {
    setSelectedOrders(prev => ({
      ...prev,
      [tracking_code]: !prev[tracking_code],
    }));
  };

  // New function: Mark an order as selected programmatically (used for scanning)
  const setSelectedOrderManually = (tracking_code: string) => {
    setSelectedOrders(prev => ({
      ...prev,
      [tracking_code]: true, // Ensure scanned orders are marked as true
    }));
  };

  // Calculate total sum of checked orders
  const totalSum = useMemo(() => {
    return selectedOrdersList
      .filter(order => selectedOrders[order.tracking_code])
      .reduce((sum, order) => sum + order.sum, 0)
      .toFixed(2);
  }, [selectedOrders, selectedOrdersList]);

  // Calculate total quantity of checked orders
  const totalQuantity = useMemo(() => {
    return selectedOrdersList.filter(order => selectedOrders[order.tracking_code]).length;
  }, [selectedOrders, selectedOrdersList]);

  return {
    selectedOrders,
    setSelectedOrders,
    totalSum,
    totalQuantity,
    handleCheckboxChange,
    setSelectedOrderManually, // Expose this function
  };
};

export default useOrder;