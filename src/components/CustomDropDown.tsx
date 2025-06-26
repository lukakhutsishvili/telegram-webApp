import { t } from "i18next";
import { useState } from "react";

interface CustomDropdownProps {
  returnOrder: string;
  setReturnOrder: React.Dispatch<React.SetStateAction<string>>;
  returnedParcelError?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  returnOrder,
  setReturnOrder,
  returnedParcelError,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: any) => {
    setReturnOrder(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full mt-2">
      <p className="font-medium mb-1 text-xs">{t("return parcel")}</p>
      <div
        className="p-2 border rounded text-xs cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {returnOrder === ""
          ? t("choose")
          : returnOrder === "yes"
          ? t("yes")
          : t("no")}
      </div>

      {open && (
        <div className="absolute left-0 w-full border rounded bg-white shadow-md text-xs z-10">
          <div
            onClick={() => handleSelect("yes")}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {t("yes")}
          </div>
          <div
            onClick={() => handleSelect("no")}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {t("no")}
          </div>
        </div>
      )}
      {returnedParcelError !== "" && (
        <p className="text-red-500 text-xs mt-1">{returnedParcelError}</p>
      )}
    </div>
  );
};

export default CustomDropdown;
