import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { tabButtons } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

function Sending() {
  return (
    <div className="flex flex-col h-screen bg-white pt-16">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">მიწოდება</h1>

        {/* Tab Navigation */}
        <div className="mt-4">
          <Swiper
            spaceBetween={10} // Space between slides
            slidesPerView={2} // Number of visible slides
            freeMode={true} // Enables free scrolling
          >
            {tabButtons.map((item) => (
              <SwiperSlide key={item.name}>
                <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md w-full">
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

      {/* parcel info */}
      <div className="h-[440px] w-full overflow-y-auto py-4"></div>

      {/* QR Code Section */}
      <div className="p-4 ">
        <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 py-4 rounded-lg text-black font-semibold text-lg shadow-md">
          <FontAwesomeIcon icon={faBarcode} />
          <span>კოდის სკანირება</span>
        </button>
      </div>
    </div>
  );
}
export default Sending;
