import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
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

const Order = ({ status }: { status: string | null }) => {
  const { sendingTasks, userInfo, setSendingTasks } = useContext(Context);
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkAll, setCheckAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Configure Sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Drag starts after moving 10px
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  // const sensors = useSensors(mouseSensor, keyboardSensor);

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Optional: Start drag after 250ms of touch
      tolerance: 5, // Optional: Move 5px before drag activates
    },
  });

  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  const filteredTasks = useMemo(() => {
    if (!sendingTasks) return [];
    let tasks = status
      ? sendingTasks.filter((task: any) => task.Status === status)
      : sendingTasks;

    if (searchTerm.trim()) {
      tasks = tasks.filter(
        (task: any) =>
          task.tracking_code.includes(searchTerm) ||
          task.client_phone.includes(searchTerm)
      );
    }
    return tasks;
  }, [status, sendingTasks, searchTerm]);

  useEffect(() => {
    setSelectedOrders({});
    setCheckAll(false);
  }, [status, searchTerm, sendingTasks]);

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
        pickup_task: false,
        status: ["Waiting", "Accepted", "Completed", "Canceled"],
      };

      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(JSON.stringify(tasklistData)),
        },
      });
      setSendingTasks(response.data.response);
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
      // Update statuses locally
      const updatedTasks = sendingTasks.map((task: any) =>
        selectedTrackingCodes.includes(task.tracking_code)
          ? { ...task, Status: newStatus }
          : task
      );
      setSendingTasks(updatedTasks);
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

    // Ensure there's a valid drag-over target
    if (!over || active.id === over.id) return;

    const oldIndex = sendingTasks.findIndex(
      (task: any) => task.tracking_code === active.id
    );
    const newIndex = sendingTasks.findIndex(
      (task: any) => task.tracking_code === over.id
    );

    const reorderedTasks = arrayMove(sendingTasks, oldIndex, newIndex);
    setSendingTasks(reorderedTasks);

    // Update sort numbers for all reordered tasks
    const updatedTasks = reorderedTasks.map((task: any, index: number) => ({
      ...task,
      sort_number: index + 1,
    }));
    setSendingTasks(updatedTasks);

    try {
      // Send updated sort numbers to the server
      for (const task of updatedTasks) {
        const payload = {
          device_id: userInfo.device_id,
          tracking_code: task.tracking_code,
          sort_number: task.sort_number,
          pickup_task: false,
        };
        await axiosInstance.post(MODIFY_SORT_NUMBER, payload);
      }
      console.log("Sort numbers updated successfully.");
    } catch (error) {
      console.error("Failed to update sort numbers:", error);
      alert(t("Failed to update sort order. Please try again."));
    }
  };

  if (!sendingTasks || sendingTasks.length === 0) {
    return <p className="text-center text-gray-500">{t("you have no task")}</p>;
  }

  return (
    <div className="relative px-4">
      <div className="sticky top-0 z-10 flex items-center bg-white">
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

      {status === "Waiting" && filteredTasks.length > 0 && (
        <div className="flex items-center gap-2 py-2 px-3 border-b-2 border-gray-500">
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
    </div>
  );
};

export default Order;
