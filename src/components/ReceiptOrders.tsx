import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

const ReceiptOrders = ({ status }: { status: string | null }) => {
  const { recieptTasks } = useContext(Context);
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});
  const [checkAll, setCheckAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  // Filter tasks based on status and search term
  const filteredTasks = useMemo(() => {
    if (!recieptTasks) return [];
    let tasks = status
      ? recieptTasks.filter((task: any) => task.Status === status)
      : recieptTasks;

    if (searchTerm.trim()) {
      tasks = tasks.filter(
        (task: any) =>
          task.tracking_code.includes(searchTerm) ||
          task.client_phone.includes(searchTerm)
      );
    }
    return tasks;
  }, [status, recieptTasks, searchTerm]);

  useEffect(() => {
    // Reset selection when the status or search term changes
    setSelectedOrders({});
    setCheckAll(false);
  }, [status, searchTerm]);

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

  if (!recieptTasks || recieptTasks.length === 0) {
    return <p className="text-center text-gray-500">{t('you have no task')}</p>;
  }


  return (
    <div className="px-4">


          {/* Search Input */}
      <div className="flex items-center  py-2 ">
        <div className="flex items-center border-2 border-gray-300 w-full rounded-md px-4 py-2">
          <FontAwesomeIcon icon={faBarcode} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="ძიება"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>
      </div>

      {/* "Check All" Checkbox */}
      {status === "Waiting" && filteredTasks.length > 0 && (
         <div className="flex items-center gap-2 py-2 px-3 border-b-2 border-gray-500 border-l-0 border-r-0">
          <input
            type="checkbox"
            checked={checkAll}
            onChange={(e) => handleCheckAllChange(e.target.checked)}
            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
          <span>{t("select all")}</span>
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
              <h2 className="text-sm">{item.client_name}</h2>
              <p className="text-sm">{item.sum} ₾</p>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBarcode} />
              <p className="text-sm">{item.tracking_code}</p>
            </div>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faPhone} />
              <p className="text-sm">{item.client_phone}</p>
            </div>
            <h2 className="text-sm">{item.client_address}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceiptOrders;
