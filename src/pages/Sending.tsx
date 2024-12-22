import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { tabButtons } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sending() {
  const navigate = useNavigate();
  
  const [selectedStatus, setSelectedStatus] = useState<string | null>('Accepted');

  const handleScanClick = () => {
    navigate("/scanner");
  };

  console.log(selectedStatus)

  return (
    <div className="flex flex-col h-screen bg-white pt-16 pb-[104px]">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">მიწოდება</h1>
        <div className="mt-4">
          <Swiper
            spaceBetween={10}
            slidesPerView={2}
            freeMode={true}
          >
            {tabButtons.map((item) => (
              <SwiperSlide key={item.name}>
                <button
                  onClick={() => setSelectedStatus(item.status)}
                  className={`px-4 py-2 ${
                    selectedStatus === item.status ? "bg-yellow-600" : "bg-yellow-400"
                  } text-black font-semibold rounded-md w-full`}
                >
                  {item.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
         {/* Search Input */}
         <div className="flex items-center px-4 py-2">
        <div className="flex items-center border-2 border-gray-300 w-full rounded-md px-4 py-2">
          <FontAwesomeIcon icon={faBarcode} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="ძიება"
            className="w-full focus:outline-none"
          />
        </div>
      </div>

      <div className="h-[440px] w-full overflow-y-auto py-4">
        <Order status={selectedStatus} />
      </div>

      <div className="p-4">
        <button
          onClick={handleScanClick}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 py-4 rounded-lg text-black font-semibold text-lg shadow-md"
        >
          <FontAwesomeIcon icon={faBarcode} />
          <span>კოდის სკანირება</span>
        </button>
      </div>
    </div>
  );
}

export default Sending;