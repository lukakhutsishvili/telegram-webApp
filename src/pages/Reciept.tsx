import { TAB_BUTTONS } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper"; // Import Swiper class for ref type
import "swiper/swiper-bundle.css";
import ReceiptOrders from "../components/ReceiptOrders";
import { t } from "i18next";
import { Context } from "../App";
import { useContext, useEffect, useRef } from "react";
import Button from "../components/Button";
import { Navigation } from "swiper/modules";

function Receipt() {
  const { tabButtons, setTabButtons, activeButton, setActiveButton } = useContext(Context);
  const swiperRef = useRef<SwiperClass | null>(null); // Correct type

  // Auto-scroll to active tab when activeButton changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(activeButton);
    }
  }, [activeButton]);

  return (
    <div className="flex flex-col h-screen bg-white pt-16 h-sm:pt-6 pb-[104px]">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">{t("pick up")}</h1>
        {/* Tab Navigation */}
        <div className="mt-4">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)} // Correct ref assignment
            spaceBetween={10}
            slidesPerView={2}
            freeMode={true}
            modules={[Navigation]}
          >
            {TAB_BUTTONS.map((item, index) => (
              <SwiperSlide key={item.name} className="w-auto">
                <Button
                  onClick={() => {
                    setTabButtons(item.status);
                    setActiveButton(index);
                  }}
                  className={`px-4 py-2 transition-all ${
                    tabButtons === item.status
                      ? "bg-yellow-600"
                      : "bg-yellow-400"
                  } text-black font-semibold text-[14px] rounded-md w-full`}
                >
                  {t(item.name)}
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
 
 
      {/* Parcel info */}
      <div className="w-full overflow-y-auto pb-4">
        <ReceiptOrders status={tabButtons} />
      </div>
    </div>
  );
}

export default Receipt;
