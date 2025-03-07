import { useTranslation } from "react-i18next";

const useValidation = (
  setErrors: React.Dispatch<React.SetStateAction<{ otherClientName: string; otherClientSurname: string; connection: string }>>
) => {
  const { t } = useTranslation();

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: t(`${field}_required`) }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateAll = (fields: { otherClientName: string; otherClientSurname: string; connection: string }) => {
    let isValid = true;
    const newErrors: { otherClientName: string; otherClientSurname: string; connection: string } = {
      otherClientName: "",
      otherClientSurname: "",
      connection: "",
    };

    Object.keys(fields).forEach((key) => {
      if (!fields[key as keyof typeof fields].trim()) {
        newErrors[key as keyof typeof fields] = t(`${key}_required`);
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return { validateField, validateAll };
};

export default useValidation;

