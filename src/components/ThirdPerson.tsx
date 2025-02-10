import { useState } from "react";
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
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errors, setErrors] = useState({ name: "", surname: "", idNumber: "" });

  // Validation function
  const validateFields = () => {
    let newErrors = { name: "", surname: "", idNumber: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t("Name is required.");
      isValid = false;
    }

    if (!surname.trim()) {
      newErrors.surname = t("Surname is required.");
      isValid = false;
    }

    if (!idNumber.trim()) {
      newErrors.idNumber = t("ID Number is required.");
      isValid = false;
    } else if (!/^\d{11}$/.test(idNumber)) {
      newErrors.idNumber = t("ID Number must be 11 digits.");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (validateFields()) {
      onConfirm();
    }
  };

  return (
    <div className="flex flex-col h-[500px] fixed  p-6 bg-white shadow-lg rounded-2xl w-96">
      <label htmlFor="name" className="text-lg font-semibold mt-4">
        სახელი
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.name ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <label htmlFor="surname" className="text-lg font-semibold mt-4">
        გვარი
      </label>
      <input
        id="surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.surname ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.surname && (
        <p className="text-red-500 text-sm">{errors.surname}</p>
      )}

      <label htmlFor="idNumber" className="text-lg font-semibold mt-4">
        პირადი ნომერი
      </label>
      <input
        id="idNumber"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.idNumber ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.idNumber && (
        <p className="text-red-500 text-sm">{errors.idNumber}</p>
      )}

      <div className="grid gap-[20px] mt-auto">
        {!confirmationMessage && (
          <Button
            onClick={handleConfirm}
            disabled={loading}
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
        <Button
          onClick={confirmationMessage ? navigationfunction : closeModal}
          className="bg-gray-300 text-black"
        >
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
};

export default ThirdPerson;
