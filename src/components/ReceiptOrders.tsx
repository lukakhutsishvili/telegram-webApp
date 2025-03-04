import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Added faSpinner
import { t } from "i18next";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { axiosInstance } from "../api/apiClient";
import { MODIFY_SORT_NUMBER, ORDER_LIST } from "../api/Constants";
import { changeOrderStatus } from "../api/requestHandlers";
import SortableItem from "./SortableItem";

const RecieptOrder = ({ status }: { status: string | null }) => {
  const { recieptTasks, userInfo, setRecieptTasks } = useContext(Context);
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkAll, setCheckAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reorderedTasks, setReorderedTasks] = useState<any>([]);
  const [startSorting, setStartSorting] = useState(false);
  const [isSorting, setIsSorting] = useState(false); // Added spinner state

  // Configure Sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  const filteredTasks = useMemo(() => {
    if (!recieptTasks) return [];
    let tasks = status
      ? recieptTasks.filter((task: any) => task.Status === status)
      : recieptTasks;
    if (searchTerm.trim()) {
      tasks = tasks.filter(
        (task: any) =>
          task.tracking_code.includes(searchTerm) ||
          task.client_phone.includes(searchTerm) ||
          task.client_name.includes(searchTerm) ||
          task.client_address.includes(searchTerm)
      );
    }
    return tasks;
  }, [status, recieptTasks, searchTerm]);

  useEffect(() => {
    setSelectedOrders({});
    setCheckAll(false);
  }, [status, recieptTasks]);

  const handleCheckboxChange = (trackingCode: string, checked: boolean) => {
    setSelectedOrders((prev) => ({ ...prev, [trackingCode]: checked }));
  };

  const handleCheckAllChange = (checked: boolean) => {
    const updatedSelection = filteredTasks.reduce((acc: any, task: any) => {
      acc[task.tracking_code] = checked;
      return acc;
    }, {});
    setSelectedOrders(updatedSelection);
    setCheckAll(checked);
  };

  const fetchUpdatedOrderList = async () => {
    try {
      const tasklistData = {
        device_id: userInfo.device_id,
        pickup_task: true,
        status: ["Waiting", "Accepted", "Completed", "Canceled"],
      };

      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(JSON.stringify(tasklistData)),
        },
      });
      setRecieptTasks(response.data.response);
      console.log("Order list updated successfully:", response);
    } catch (error) {
      console.error("Failed to fetch order list:", error);
    }
  };

  const handleAllStatusChange = async (newStatus: string) => {
    const selectedTrackingCodes = Object.keys(selectedOrders).filter(
      (trackingCode) => selectedOrders[trackingCode]
    );

    if (selectedTrackingCodes.length === 0) {
      alert(t("No orders selected!"));
      return;
    }

    try {
      const updatedTasks = recieptTasks.map((task: any) =>
        selectedTrackingCodes.includes(task.tracking_code)
          ? { ...task, Status: newStatus }
          : task
      );
      setRecieptTasks(updatedTasks);

      const params = {
        device_id: userInfo.device_id,
        status: newStatus,
        orders: selectedTrackingCodes,
      };

      const response = await changeOrderStatus(params);
      console.log("Order statuses updated successfully:", response);

      setSelectedOrders({});
      setCheckAll(false);

      alert(t("Selected orders updated successfully!"));
    } catch (error: any) {
      console.error("Failed to update order statuses:", error);
      alert(t("Failed to update orders. Please try again."));
    }

    await fetchUpdatedOrderList();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = recieptTasks.findIndex(
      (task: any) => task.tracking_code === active.id
    );
    const newIndex = recieptTasks.findIndex(
      (task: any) => task.tracking_code === over.id
    );
    const reorderedTasks = arrayMove(recieptTasks, oldIndex, newIndex);
    setRecieptTasks(reorderedTasks);
    const updatedTasks = reorderedTasks.map((task: any, index: number) => ({
      ...task,
      sort_number: index + 1,
    }));
    setRecieptTasks(updatedTasks);
    setReorderedTasks(updatedTasks);
  };

  const handleSorting = async () => {
    const payLoad = {
      device_id: userInfo.device_id || "6087086146",
      response: reorderedTasks,
      pickup_task: true,
    };
    console.log(payLoad);
    try {
      const res = await axiosInstance.post(MODIFY_SORT_NUMBER, payLoad);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  if (!recieptTasks || recieptTasks.length === 0) {
    return <p className="text-center text-gray-500">{t("you have no task")}</p>;
  }

  return (
    <div className="relative px-4">
      {/* Search bar with corrected z-index */}
      <div className="sticky top-0 z-30 flex items-center bg-white shadow-md py-2">
        <div className="flex items-center border-2 border-gray-300 w-full rounded-md px-4 py-2">
          <FontAwesomeIcon
            onClick={() => navigate("/scanner")}
            icon={faBarcode}
            className="text-gray-500 mr-2"
          />
          <input
            type="text"
            placeholder="ძიება"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Sorting Control Buttons */}
      <div className="relative z-[0]">
        {startSorting ? (
          <button
            onClick={async () => {
              setIsSorting(true);
              await handleSorting();
              setIsSorting(false);
              setStartSorting(false);
            }}
            className="m-2 p-2 bg-blue-500 text-white rounded"
          >
            Stop Sorting
          </button>
        ) : (
          <button
            onClick={() => setStartSorting(true)}
            className="m-2 p-2 bg-green-500 text-white rounded"
          >
            Start Sorting
          </button>
        )}
      </div>

      {status === "Waiting" && filteredTasks.length > 0 && (
        <div className="sticky top-[60px] z-30 flex items-center gap-2 py-2 px-3 border-b-2 border-gray-500 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checkAll}
              onChange={(e) => handleCheckAllChange(e.target.checked)}
              className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
            />
            <span>{t("select all")}</span>
          </div>
          <button
            onClick={() => handleAllStatusChange("Accepted")}
            className="ml-auto px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-md"
          >
            {t("accept all")}
          </button>
        </div>
      )}

      {/* Sortable UI */}
      <div className="relative z-20">
        {startSorting ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((task: any) => task.tracking_code)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map((item: any) => (
                <SortableItem
                  key={item.tracking_code}
                  id={item.tracking_code}
                  task={item}
                  status={status}
                  navigate={navigate}
                  handleCheckboxChange={handleCheckboxChange}
                  selectedOrders={selectedOrders}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          // Render static list when sorting is disabled
          filteredTasks.map((item: any) => (
            <SortableItem
              key={item.tracking_code}
              id={item.tracking_code}
              task={item}
              status={status}
              navigate={navigate}
              handleCheckboxChange={handleCheckboxChange}
              selectedOrders={selectedOrders}
            />
          ))
        )}
      </div>

      {/* Spinner overlay shown during the async sorting update */}
      {isSorting && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 bg-opacity-50 bg-white">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-blue-500"
          />
          <p className="mt-4 text-blue-500">please wait for sorting</p>
        </div>
      )}
    </div>
  );
};

export default RecieptOrder;
