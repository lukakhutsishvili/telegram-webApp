import { useTranslation } from "react-i18next";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium mb-2">
        {t("Payment Method")}
      </label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full p-2 border rounded text-xs"
      >
        <option value="Cash">{t("Cash")}</option>
        <option value="bank_card">{t("Bank")}</option>
      </select>
    </div>
  );
};

export default PaymentMethodSelector;

