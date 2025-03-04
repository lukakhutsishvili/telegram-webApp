
import { t } from "i18next";



const useValidation = (setErrors: React.Dispatch<React.SetStateAction<{ otherClientName: string; otherClientSurname: string; connection: string }>>) => {

    const validateField = (field: string, value: string) => {
        if (!value.trim()) {
          setErrors((prev) => ({ ...prev, [field]: t(`${field} is required.`) }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };
  
    const validateAll = (fields: { otherClientName: string; otherClientSurname: string; connection: string }) => {
      let isValid = true;
      const newErrors: { otherClientName: string; otherClientSurname: string; connection: string } = { otherClientName: "", otherClientSurname: "", connection: "" };
  
      Object.keys(fields).forEach((key) => {
        if (!fields[key as keyof typeof fields].trim()) {
          newErrors[key as keyof typeof fields] = t(`${key} is required.`);
          isValid = false;
        }
      });
  
      setErrors(newErrors);
      return isValid;
    };
  
    return { validateField, validateAll };
};

export default useValidation;
