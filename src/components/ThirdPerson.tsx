
import { t } from "i18next";
import useRelationships from "../hooks/confirm modal hooks/useRelationship";

interface ThirdPersonProps {
  otherClientName: string;
  otherClientSurname: string;
  connection: string;
  additionalComment: string;
  setOtherClientName: (value: string) => void;
  setOtherClientSurname: (value: string) => void;
  setConnection: (value: string) => void;
  setAdditionalComment: (value: string) => void;
  errors: { otherClientName: string; otherClientSurname: string; connection: string };
  setErrors: React.Dispatch<React.SetStateAction<{ otherClientName: string; otherClientSurname: string; connection: string }>>;
  receiptOrder: any;
  sendingOrder: any;
  selectedOrders: { [key: string]: boolean };
  totalSum: string;
}


const ThirdPerson: React.FC<ThirdPersonProps> = (
  {otherClientName, otherClientSurname, connection, additionalComment, setOtherClientName, setOtherClientSurname, setConnection, setAdditionalComment, errors, setErrors}
) => {

  const { relationshipData } = useRelationships();


  console.log(relationshipData)
  return (
    <div className="flex flex-col gap-3">
     <div className="relative w-full">
      <input
        placeholder="Name"
        value={otherClientName}
        onChange={(e) => {
          setOtherClientName(e.target.value);
          errors.otherClientName && setErrors((prev) => ({ ...prev, name: "" }));
        }}
        className={`w-full p-2 border rounded-sm text-xs placeholder:text-xs pr-12 ${
          errors.otherClientName ? "border-red-500 text-red-600" : "border-gray-300"
        }`}
      />
      {errors.otherClientName && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xs bg-white px-1">
          {errors.otherClientName}
        </span>
      )}
    </div>
    <div className="relative w-full">
      <input
        placeholder="Surname"
        value={otherClientSurname}
        onChange={(e) => {
          setOtherClientSurname(e.target.value);
          errors.otherClientSurname && setErrors((prev) => ({ ...prev, surname: "" }));
        }}
        className={`w-full p-2 border rounded-sm text-xs placeholder:text-xs pr-12 ${
          errors.otherClientSurname ? "border-red-500 text-red-600" : "border-gray-300"
        }`}
      />
      {errors.otherClientSurname && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xs bg-white px-1">
          {errors.otherClientSurname}
        </span>
      )}
    </div>


    <select
      value={connection}
      onChange={(e) => {
        setConnection(e.target.value);
        errors.connection && setErrors((prev) => ({ ...prev, connection: "" }));
      }}
      className={`p-2 border text-xs ${errors.connection ? "border-red-500" : "border-gray-300"}`}
    >
      <option value="">{t("Choose Connection")}</option>
      {relationshipData?.map((relationship, index) => (
        <option key={index} value={relationship.Code}>
          {relationship.Description}
        </option>
      ))}
    </select>

      <input
        type="text"
        value={additionalComment}
        onChange={(e) => setAdditionalComment(e.target.value)}
        placeholder={t("დამატებითი კომენტარი")}
        className="w-full text-xs p-2 border rounded placeholder:text-xs"
      />
    </div>
  );
};

export default ThirdPerson;
