import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useOrder = (
  selectedOrdersList: {
    tracking_code: string;
    sum: number;
    sumcash?: number;
    places?: { tracking_code: string; sum: number }[];
  }[]
) => {
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const path = location.pathname;
  const orderId = path.split("/").pop();

  
  const matchedOrder = selectedOrdersList.find(
    (order) =>
      order.tracking_code === orderId &&
      order.places &&
      order.places.length > 0
  );

  useEffect(() => {
    const initialSelection: { [key: string]: boolean } = {};


    if (matchedOrder && matchedOrder.places) {
      matchedOrder.places.forEach((place) => {
        initialSelection[place.tracking_code] = false;
      });
    } else {
      const firstOrderWithoutPlaces = selectedOrdersList.find(
        (order) => !order.places || order.places.length === 0
      );

      if (firstOrderWithoutPlaces) {
        initialSelection[firstOrderWithoutPlaces.tracking_code] = true;
      }
    }

    setSelectedOrders(initialSelection);
  }, [matchedOrder]);

  const handleCheckboxChange = (tracking_code: string) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [tracking_code]: !prev[tracking_code],
    }));
  };

  const allOrders: { tracking_code: string; sum: number; sumcash?: number }[] = selectedOrdersList.flatMap((order) =>
    order.places && order.places.length > 0
      ? order.places.map((place) => ({
          ...place,
          sumcash: order.sumcash, 
        }))
      : [order]
  );

  const totalSum = matchedOrder ? matchedOrder.sum :  allOrders
    .filter((order) => selectedOrders[order.tracking_code])
    .reduce((sum, order) => sum + order.sum, 0)
    .toFixed(2) ;

  const totalSumCash = matchedOrder ? matchedOrder.sumcash :  allOrders
    .filter((order) => selectedOrders[order.tracking_code])
    .reduce((sum, order) => sum + (order.sumcash ?? 0), 0)
    .toFixed(2) ;

  const totalQuantity = allOrders.filter(
    (order) => selectedOrders[order.tracking_code]
  ).length;

  return {
    selectedOrders,
    setSelectedOrders,
    totalSum,
    totalSumCash,
    totalQuantity,
    handleCheckboxChange,
  };
};

export default useOrder;
