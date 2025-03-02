
import { t } from "i18next";
import useClientConfirmation from "../hooks/confirm modal hooks/useClientConfirmation";

interface ThirdPersonProps {
  name: string;
  surname: string;
  connection: string;
  additionalComment: string;
  setName: (value: string) => void;
  setSurname: (value: string) => void;
  setConnection: (value: string) => void;
  setAdditionalComment: (value: string) => void;
  errors: { name: string; surname: string; connection: string };
  setErrors: React.Dispatch<React.SetStateAction<{ name: string; surname: string; connection: string }>>;
  receiptOrder: any;
  sendingOrder: any;
  selectedOrders: { [key: string]: boolean };
  totalSum: string;
}


const ThirdPerson: React.FC<ThirdPersonProps> = (
  { name, surname, connection, additionalComment, setName, setSurname, setConnection, setAdditionalComment, errors, setErrors, selectedOrders, totalSum, sendingOrder, receiptOrder}
) => {

  const {otherClientName, otherClientSurname} = useClientConfirmation(selectedOrders, totalSum, sendingOrder, receiptOrder)

  return (
    <div className="flex flex-col gap-3">
     <div className="relative w-full">
      <input
        placeholder="Name"
        value={otherClientName ? otherClientName : name}
        onChange={(e) => {
          setName(e.target.value);
          errors.name && setErrors((prev) => ({ ...prev, name: "" }));
        }}
        className={`w-full p-2 border rounded-sm text-xs placeholder:text-xs pr-12 ${
          errors.name ? "border-red-500 text-red-600" : "border-gray-300"
        }`}
      />
      {errors.name && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xs bg-white px-1">
          {errors.name}
        </span>
      )}
    </div>
    <div className="relative w-full">
      <input
        placeholder="Surname"
        value={otherClientSurname ? otherClientName : surname}
        onChange={(e) => {
          setSurname(e.target.value);
          errors.surname && setErrors((prev) => ({ ...prev, surname: "" }));
        }}
        className={`w-full p-2 border rounded-sm text-xs placeholder:text-xs pr-12 ${
          errors.surname ? "border-red-500 text-red-600" : "border-gray-300"
        }`}
      />
      {errors.surname && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xs bg-white px-1">
          {errors.surname}
        </span>
      )}
    </div>


      <select
        value={connection}
        onChange={(e) => {
          setConnection(e.target.value);

        }}
        className={`p-2 border text-xs ${errors.connection ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Choose Connection</option>
        <option value="parent">Parent</option>
        <option value="child">Child</option>
        <option value="neighbor">Neighbor</option>
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
