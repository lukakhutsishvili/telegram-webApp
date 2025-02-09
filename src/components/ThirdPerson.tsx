import { t } from "i18next";
import Button from "./Button";

type ThirdPersonTypes = {
  onConfirm(): void;
  loading: boolean;
  navigationfunction(): void;
  closeModal: () => void;
  confirmationMessage: string;
};

const ThirdPerson: React.FC<ThirdPersonTypes> = ({
  onConfirm,
  navigationfunction,
  closeModal,
  loading,
  confirmationMessage,
}) => {
  return (
    <div className="flex flex-col  fixed gap-4 p-6 bg-white shadow-lg rounded-2xl w-96">
      <label htmlFor="name" className="text-lg font-semibold">
        სახელი
      </label>
      <input
        id="name"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="surname" className="text-lg font-semibold">
        გვარი
      </label>
      <input
        id="surname"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="idNumber" className="text-lg font-semibold">
        პირადი ნომერი
      </label>
      <input
        id="idNumber"
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div>
        <Button
          onClick={confirmationMessage ? navigationfunction : closeModal}
          className="bg-gray-300 text-black"
        >
          {t("cancel")}
        </Button>

        {!confirmationMessage && (
          <Button
            onClick={onConfirm}
            disabled={loading} // Disable button when loading
            className={`bg-gray-300 text-black ${
              loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></div>
                <span className="ml-2">{t("loading")}</span>
              </div>
            ) : (
              t("confirm")
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ThirdPerson;
