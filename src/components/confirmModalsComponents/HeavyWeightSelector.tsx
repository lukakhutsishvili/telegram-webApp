import { useTranslation } from "react-i18next";

interface Props {
  floorDeliveryMethod: string;
  setFloorDeliveryMethod: (value: string) => void;
}

const HeavyWeightSelector = ({ floorDeliveryMethod, setFloorDeliveryMethod }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium mb-2">
        {t("სართულზე მიწოდების მეთოდი")}
      </label>
      <select
        value={floorDeliveryMethod}
        onChange={(e) => setFloorDeliveryMethod(e.target.value)}
        className="w-full p-2 border rounded text-xs"
      >
        <option value="" disabled hidden>{t("აირჩიეთ მიწოდების მეთოდი")}</option>
        <option value="კიბე">{t("კიბე")}</option>
        <option value="ლიფტი">{t("ლიფტი")}</option>
        <option value="არ სურს ატანა">{t("არ სურს ატანა")}</option>
      </select>
    </div>
  );
};

export default HeavyWeightSelector;

