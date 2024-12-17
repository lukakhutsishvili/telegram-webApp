import { useContext } from "react";
import { Context } from "../App";

const Order = () => {
  const { recieptTasks } = useContext(Context);

  console.log(recieptTasks);

  return (
    <div className="px-4">
      {recieptTasks.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className=" border-t-2 border-b-2 border-gray-500 border-l-0 border-r-0"
          >
            <h2>{item.client_name}</h2>
            <p>{item.client_phone}</p>
            <h2>{item.client_address}</h2>
            <p>{item.sum}</p>
            <p>{item.tracking_code}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Order;
