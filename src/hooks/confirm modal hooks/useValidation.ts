
import { t } from "i18next";



const useValidation = (setErrors: React.Dispatch<React.SetStateAction<{ name: string; surname: string; connection: string }>>) => {

    const validateField = (field: string, value: string) => {
        if (!value.trim()) {
          setErrors((prev) => ({ ...prev, [field]: t(`${field} is required.`) }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };
  
    const validateAll = (fields: { name: string; surname: string; connection: string }) => {
      let isValid = true;
      const newErrors: { name: string; surname: string; connection: string } = { name: "", surname: "", connection: "" };
  
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
