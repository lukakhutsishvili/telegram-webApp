
interface OrderWithComponentsProps {
  order: {
    places: { description: string; tracking_code: string }[];
  };
  handleCheckboxChange: (tracking_code: string) => void;
}
  
function OrderWithComponents({ order, handleCheckboxChange }: OrderWithComponentsProps) {
  
  
    return (
    <div className="mt-6 flex flex-col gap-2 overflow-y-auto h-auto max-h-60">
       {order.places.map((place: any, index: number) => (
            <div key={index} className="flex gap-4 border-2 border-black px-3 py-1 rounded">
                <input
                    type="checkbox"
                    disabled={place.tracking_code} // Disabled if checked is false
                    checked={!place.tracking_code} // Checked state
                    onChange={() => handleCheckboxChange(place.tracking_code)}
                />
                <div className="flex justify-between w-full">
                    <p className="text-sm">{place.description}</p>
                    <p className="text-sm"
                        onClick={() =>navigator.clipboard.writeText(place.tracking_code)}>
                        {place.tracking_code}
                    </p>
                </div>
            </div>
       ))}
    </div>
  )
}

export default OrderWithComponents
