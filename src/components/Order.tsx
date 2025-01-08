import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { axiosInstance } from "../api/apiClient";
import { ORDER_LIST } from "../api/Constants";
import { changeOrderStatus } from "../api/requestHandlers";

const SortableItem = ({
  id,
  task,
  status,
  navigate,
  handleCheckboxChange,
  selectedOrders,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if the event originates from a checkbox
    if ((e.target as HTMLElement).tagName === "INPUT") {
      e.stopPropagation();
      return;
    }
    if (!isDragging) {
      navigate(`/order/${task.tracking_code}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="relative z-0 first:border-t-2 border-b-2 py-2 px-3 border-gray-500 flex gap-4"
    >
      {status === "Waiting" && (
        <div className="absolute top-8 z-50 flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={!!selectedOrders[task.tracking_code]}
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
            onChange={(e) =>
              handleCheckboxChange(task.tracking_code, e.target.checked)
            }
            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-1 pl-9">
        <div className="flex justify-between">
          <h2 className="text-sm">{task.client_name}</h2>
          <p className="text-sm">{task.sum} ₾</p>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faBarcode} />
          <p className="text-sm">{task.tracking_code}</p>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faPhone} />
          <p className="text-sm">{task.client_phone}</p>
        </div>
        <h2 className="text-sm">{task.client_address}</h2>
      </div>
    </div>
  );
};

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
  const sensors = useSensors(mouseSensor, keyboardSensor);

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sendingTasks.findIndex(
      (task: any) => task.tracking_code === active.id
    );
    const newIndex = sendingTasks.findIndex(
      (task: any) => task.tracking_code === over.id
    );

    console.log(`From index: ${oldIndex}, tracking code: ${active.id}`);

    const newOrder = arrayMove(sendingTasks, oldIndex, newIndex);
    setSendingTasks(newOrder);
    console.log(`To index: ${newIndex}, tracking code: ${over.id}`);
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
