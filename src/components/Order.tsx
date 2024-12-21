import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBarcode } from "@fortawesome/free-solid-svg-icons";

const Order = ({ status }: { status: string | null }) => {
  const { sendingTasks } = useContext(Context); 
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  
  // Filter tasks based on status
  useEffect(() => {
    const tasks = status
      ? sendingTasks.filter((task: any) => task.Status === status)
      : sendingTasks;

    setFilteredTasks(tasks);
  }, [status, sendingTasks]);


    console.log(filteredTasks)
  return (
    <div className="px-4">
      {filteredTasks.map((item: any, index: number) => (
        <div
          key={index}
          className="first:border-t-2 border-b-2 py-2 px-3 flex flex-col gap-1 border-gray-500 border-l-0 border-r-0 cursor-pointer"
          onClick={() => navigate(`/order/${item.tracking_code}`)}
        >
          <div className="flex justify-between">
            <h2>{item.client_name}</h2>
            <p>{item.sum} ₾</p>
          </div>
          <div className="flex justify-between">
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
      ))}
    </div>
  );
};

export default Order;