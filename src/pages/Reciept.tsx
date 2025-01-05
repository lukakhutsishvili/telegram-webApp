import { TAB_BUTTONS } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import ReceiptOrders from "../components/ReceiptOrders";
import { t } from "i18next";
import { Context } from "../App";
import { useContext } from "react";

function Reciept() {

  const { tabButtons, setTabButtons } = useContext(Context);

  return (
    <div className="flex flex-col h-screen bg-white pt-16 ">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">{t("pick up")}</h1>

        {/* Tab Navigation */}
        <div className="mt-4">
          <Swiper spaceBetween={10} slidesPerView={2} freeMode={true}>
            {TAB_BUTTONS.map((item) => (
              <SwiperSlide key={item.name}>
                <button
                  onClick={() => setTabButtons(item.status)}
                  className={`px-4 py-2 ${
                    tabButtons === item.status
                      ? "bg-yellow-600"
                      : "bg-yellow-400"
                  } text-black font-semibold text-[14px] rounded-md w-full`}
                >
                  {t(item.name)}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Parcel info */}
      <div className=" w-full overflow-y-auto pb-4">
        <ReceiptOrders status={tabButtons} />
      </div>

    
    </div>
  );
}

export default Reciept;
