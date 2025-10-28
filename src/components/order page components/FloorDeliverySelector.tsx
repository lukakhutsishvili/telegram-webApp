import { useState, ChangeEvent } from 'react'

interface Props {
    order: {
        HeavyWeight?: boolean;
    };
}

function FloorDeliverySelector({order}: Props) {
    
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const handleMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDeliveryMethod(event.target.value);
    };
  return (
    <div>
        {order?.HeavyWeight && (
            <div className="p-1 flex justify-between items-center">
                <p>აირჩიეთ მიწოდების მეთოდი</p>
                <div className="flex items-center gap-4">
                  {/* კიბით ატანის ვარიანტი */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod" 
                      value="stairs" 
                      checked={deliveryMethod === 'stairs'} 
                      onChange={handleMethodChange} 
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-600">კიბე</span>
                      <span className="font-semibold text-blue-600">თანხა</span>
                    </div>
                  </label>

                  {/* ლიფტით ატანის ვარიანტი */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod" 
                      value="elevator" 
                      checked={deliveryMethod === 'elevator'} 
                      onChange={handleMethodChange} 
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-blue-600">ლიფტი</span>
                      <span className="font-semibold text-blue-600">თანხა</span>
                    </div>
                </label>
            </div>
        </div>
        )}
    </div>
  )
}

export default FloorDeliverySelector