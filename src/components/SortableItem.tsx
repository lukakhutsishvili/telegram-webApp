import { useSortable } from "@dnd-kit/sortable";
import { faBarcode, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSS } from "@dnd-kit/utilities";

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

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "pointer",
    background: isDragging ? "rgba(100, 100, 0, 0.2)" : "white",
    boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
    opacity: isDragging ? 0.9 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
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
      className={`relative z-0 first:border-t-2 border-b-2 py-2 px-3 border-gray-500 flex gap-4 ${
        isDragging ? "ring-2 ring-yellow-500 scale-105" : "" } `}
    >
      {status === "Waiting" && (
        <div 
        className="flex items-center select-none"
        onClick={() => handleCheckboxChange(task.tracking_code, !selectedOrders[task.tracking_code])}>
          <input
            type="checkbox"
            checked={!!selectedOrders[task.tracking_code]}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              handleCheckboxChange(task.tracking_code, e.target.checked)
            }
            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
        </div>
      )}

      {status === "Accepted" && (
        <div 
        className="flex items-center select-none"
        onClick={() => handleCheckboxChange(task.tracking_code, !selectedOrders[task.tracking_code])}>
          <input
            type="checkbox"
            checked={!!selectedOrders[task.tracking_code]}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              handleCheckboxChange(task.tracking_code, e.target.checked)
            }
            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
          />
        </div>
      )}

      <div 
      className={`relative w-full flex flex-col gap-1  select-none`}
      onClick={handleClick}>
        <div className="flex justify-between">
          <h2 className="text-sm">{task.client_name}</h2>
          <p className="text-sm">{task.sum} ₾</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faBarcode} />
            <p className="text-sm">{task.tracking_code}</p>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faPhone} />
            <p className="text-sm">{task.client_phone}</p>
          </div>
        </div>
        <h2 className="text-sm">{task.client_address}</h2>
      </div>
    </div>
  );
};

export default SortableItem;
