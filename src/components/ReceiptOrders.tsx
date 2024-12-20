import { useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBarcode } from "@fortawesome/free-solid-svg-icons";

const ReceiptOrders = () => {
  const { recieptTasks } = useContext(Context);
  const navigate = useNavigate(); 



  return (
    <div className="px-4">
      {recieptTasks.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className=" first:border-t-2 border-b-2 py-2 px-3 flex flex-col gap-1 border-gray-500 border-l-0 border-r-0"
            onClick={() => navigate(`/order/${item.tracking_code}`)} 
          >
            <div className="flex justify-between ">
              <h2>{item.client_name}</h2>
              <p>{item.sum} ₾ </p>
            </div>
            <div className="flex justify-between ">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faBarcode} />
                <p>{item.tracking_code}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faPhone} />
                <p>{item.client_phone}</p>
              </div>
            </div>
              <h2>{item.client_address}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptOrders;
