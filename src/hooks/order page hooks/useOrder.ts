import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useOrder = (
  selectedOrdersList: {
    tracking_code: string;
    sum: number;
    places?: { tracking_code: string }[];
  }[]
) => {
  const [selectedOrders, setSelectedOrders] = useState<{
    [key: string]: boolean;
  }>({});

  const location = useLocation();

  // Initialize selectedOrders state with all tracking codes set to false
  useEffect(() => {
    const initialSelection: { [key: string]: boolean } = {};
    const path = location.pathname;
    const orderId = path.split("/").pop();

    const matchedOrder = selectedOrdersList.find(
      (order) =>
        order.tracking_code === orderId &&
        order.places &&
        order.places.length > 0
    );

    if (matchedOrder && matchedOrder.places) {
      matchedOrder.places.forEach((place) => {
        initialSelection[place.tracking_code] = false;
      });
    } else {
      // Fallback: select the first order without places by default
      const firstOrderWithoutPlaces = selectedOrdersList.find(
        (order) => !order.places || order.places.length === 0
      );

      if (firstOrderWithoutPlaces) {
        initialSelection[firstOrderWithoutPlaces.tracking_code] = true;
      }
    }

    setSelectedOrders(initialSelection);
  }, []);

  console.log(selectedOrders);
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
    .reduce((sum, order) => sum + order.sum, 0)
    .toFixed(2);

  const totalQuantity = selectedOrdersList.filter(
    (order) => selectedOrders[order.tracking_code]
  ).length;

  return {
    selectedOrders,
    setSelectedOrders,
    totalSum,
    totalQuantity,
    handleCheckboxChange,
  };
};

export default useOrder;
