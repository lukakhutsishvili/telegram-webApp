import { t } from "i18next";

interface SameClientsOrdersProps {
  selectedOrdersList: {
    tracking_code: string;
    sum: number;
    client_address: string;
    places?: any[];
    parcel_with_return?: boolean;
  }[];
  selectedOrders: { [key: string]: boolean };
  differentAddressOrders: { tracking_code: string }[];
  handleCheckboxChange: (tracking_code: string) => void;
}

function SameClientsOrders({selectedOrdersList,selectedOrders,differentAddressOrders,handleCheckboxChange,}: SameClientsOrdersProps) {
  
// Filter out orders with places
const filteredOrders = selectedOrdersList.filter(
  (order) => !order.places || order.places.length === 0
);

// Determine if we should show return parcels only or normal ones
const showReturnParcels = filteredOrders.length > 0 && filteredOrders[0].parcel_with_return;

const visibleOrders = filteredOrders.filter(
  (order) => !!order.parcel_with_return === showReturnParcels
);

  return (
    <div>
      <ul className="mt-6 flex flex-col gap-2 overflow-y-auto h-auto max-h-60">
        {visibleOrders.map((order) => (
          <li
            key={order.tracking_code}
            className={`border-2 ${
              differentAddressOrders.some(
                (diffOrder) => diffOrder.tracking_code === order.tracking_code
              )
                ? "border-red-600"
                : "border-black"
            } text-gray-700 rounded-lg flex gap-3 items-center px-3`}
          >
            <input
              type="checkbox"
              disabled={!selectedOrders[order.tracking_code]} // Disable if not selected
              checked={!!selectedOrders[order.tracking_code]} // Checked state
              onChange={() => handleCheckboxChange(order.tracking_code)}
            />
            <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between items-center">
                <span className="font-base text-xs">{t("barcode")} :</span>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(order.tracking_code)
                  }
                  className="text-sm text-blue-500 underline cursor-pointer"
                >
                  {order.tracking_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-base text-sm">{t("address")}:</span>
                <span className="font-base text-sm text-right">
                  {order.client_address}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-base text-sm">{t("sum")} :</span>
                <span className="font-base text-sm">{order.sum} ₾</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SameClientsOrders;
