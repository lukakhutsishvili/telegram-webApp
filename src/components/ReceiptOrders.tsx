import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBarcode } from "@fortawesome/free-solid-svg-icons";

const ReceiptOrders = ({ status }: { status: string | null }) => {
  const { recieptTasks } = useContext(Context);
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});
  const [checkAll, setCheckAll] = useState(false);

  // Filter tasks based on status
  useEffect(() => {
    const tasks = status
      ? recieptTasks.filter((task: any) => task.Status === status)
      : recieptTasks;

    setFilteredTasks(tasks);
    // Reset selection when the status changes
    setSelectedOrders({});
    setCheckAll(false);
  }, [status, recieptTasks]);

  const handleCheckboxChange = (trackingCode: string, checked: boolean) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [trackingCode]: checked,
    }));
  };

  const handleCheckAllChange = (checked: boolean) => {
    const updatedSelection = filteredTasks.reduce((acc: any, task: any) => {
      acc[task.tracking_code] = checked;
      return acc;
    }, {});
    setSelectedOrders(updatedSelection);
    setCheckAll(checked);
  };

  return (
    <div className="px-4">
      {/* "Check All" Checkbox */}
      {status === "Waiting" && filteredTasks.length > 0 && (
         <div className="flex items-center gap-2 py-2 px-3 border-b-2 border-gray-500 border-l-0 border-r-0">
          <input
            type="checkbox"
            checked={checkAll}
            onChange={(e) => handleCheckAllChange(e.target.checked)}
            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
          <span>Select All</span>
        </div>
      )}

      {/* Orders List */}
      {filteredTasks.map((item: any, index: number) => (
        <div
          key={index}
          className="first:border-t-2 border-b-2 py-2 px-3 border-gray-500 border-l-0 border-r-0 flex gap-4"
        >
          {/* Conditional Checkbox */}
          {status === "Waiting" && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={!!selectedOrders[item.tracking_code]}
                onChange={(e) =>
                  handleCheckboxChange(item.tracking_code, e.target.checked)
                }
                className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
              />
            </div>
          )}
          {/* Order Details */}
          <div
            className="w-full flex flex-col gap-1 cursor-pointer"
            onClick={() => navigate(`/order/${item.tracking_code}`)}
          >
            <div className="flex justify-between">
              <h2>{item.client_name}</h2>
              <p>{item.sum} ₾</p>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBarcode} />
              <p>{item.tracking_code}</p>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faPhone} />
              <p>{item.client_phone}</p>
            </div>
            <h2>{item.client_address}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceiptOrders;
