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
    let initialSelection: { [key: string]: boolean } = {};

    selectedOrdersList.forEach((order, index) => {
      if (order.places && order.places.length > 0) {
        const path = location.pathname;
        const orderId = path.split("/").pop();
        const order = selectedOrdersList.find(
          (order) => orderId == order.tracking_code
        );
        order?.places?.forEach((place) => {
          initialSelection[place.tracking_code] = false;
        });
        return;
      } else {
        // If no "places", select the first one by default
        initialSelection[order.tracking_code] = index === 0;
      }
    });

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
