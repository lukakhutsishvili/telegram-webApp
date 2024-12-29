import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { tabButtons } from "../Lib/helpers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import ReceiptOrders from "../components/ReceiptOrders";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

function Reciept() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>('Accepted');

  const handleScanClick = () => {
    navigate("/scanner");
  };

  return (
    <div className="flex flex-col h-screen bg-white pt-16 pb-[104px]">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">{t("pick up")}</h1>

        {/* Tab Navigation */}
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
      <div className="h-[440px] w-full overflow-y-auto py-4">
        <ReceiptOrders status={selectedStatus}/>
      </div>

      {/* QR Code Section */}
      <div className="p-4">
        <button 
        onClick={handleScanClick}
        className="w-full flex items-center justify-center gap-2 bg-yellow-400 py-4 rounded-lg text-black font-semibold text-base shadow-md">
          <FontAwesomeIcon icon={faBarcode} />
          <span>{t('scan the code')}</span>
        </button>
      </div>
    </div>
  );
}

export default Reciept;
