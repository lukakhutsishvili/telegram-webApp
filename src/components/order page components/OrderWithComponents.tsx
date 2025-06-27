interface OrderWithComponentsProps {
  order: {
    places: { description: string; tracking_code: string }[];
  };
  handleCheckboxChange: (tracking_code: string) => void;
  selectedOrders: { [key: string]: boolean };
}

function OrderWithComponents({
  order,
  handleCheckboxChange,
  selectedOrders,
}: OrderWithComponentsProps) {
  return (
    <div className="mt-6 flex flex-col gap-2 overflow-y-auto h-auto max-h-60">
      {order.places.map((place, index) => (
        <div
          key={index}
          className="flex gap-4 border-2 border-black px-3 py-1 rounded"
        >
          <input
            type="checkbox"
            // disabled={!selectedOrders[place.tracking_code]}
            checked={!!selectedOrders[place.tracking_code]}
            onChange={() => handleCheckboxChange(place.tracking_code)}
          />
          <div className="flex justify-between w-full">
            <p className="text-sm">{place.description}</p>
            <p
              className="text-sm"
              onClick={() => navigator.clipboard.writeText(place.tracking_code)}
            >
              {place.tracking_code}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderWithComponents;
