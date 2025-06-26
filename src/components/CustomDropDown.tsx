import { t } from "i18next";
import { useState } from "react";

const CustomDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); // "" = not selected

  const handleSelect = (val: any) => {
    setValue(val);
    setOpen(false);
  };

  console.log(value);

  return (
    <div className="relative w-full">
      <div
        className="p-2 border rounded text-xs cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {value === "" ? t("choose") : value === "true" ? t("yes") : t("no")}
      </div>

      {open && (
        <div className="absolute left-0 w-full border rounded bg-white shadow-md text-xs z-10">
          <div
            onClick={() => handleSelect("true")}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {t("yes")}
          </div>
          <div
            onClick={() => handleSelect("false")}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {t("no")}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
