import { useTranslation } from "react-i18next";

interface Props {
  confirmationMethod: string;
  onChange: (value: string) => void;
}

const ConfirmationMethodSelector = ({ confirmationMethod, onChange }: Props) => {
  const { t } = useTranslation(); 

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2 text-xs">
        {t("Confirmation Method")}
      </label>
      <select
        value={confirmationMethod}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded text-xs"
      >
        <option value="OTP">{t("OTP")}</option>
        <option value="ID Number">{t("ID Number")}</option>
        <option value="Other">{t("Other Person")}</option>
        <option value="Signature">{t("Signature")}</option>
      </select>
    </div>
  );
};

export default ConfirmationMethodSelector;

