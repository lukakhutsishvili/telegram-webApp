import { TAB_BUTTONS } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Order from "../components/Order";
import { useContext } from "react";
import { t } from "i18next";
import { Context } from "../App";
import Button from "../components/Button";

function Sending() {
  const { tabButtons, setTabButtons } = useContext(Context);

  return (
    <div className="flex flex-col h-screen bg-white pt-16 h-sm:pt-6 pb-[104px]">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">{t("delivery")}</h1>
        <div className="mt-4">
          <Swiper spaceBetween={10} slidesPerView={2} freeMode={true}>
            {TAB_BUTTONS.map((item) => (
              <SwiperSlide key={item.name}>
                <Button
                  onClick={() => setTabButtons(item.status)}
                  className={`px-4 py-2 ${
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

      <div className=" w-full overflow-y-auto pb-4">
        <Order status={tabButtons} />
      </div>

     
    </div>
  );
}

export default Sending;
