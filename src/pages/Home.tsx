import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faMoneyCheckDollar, faBox } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/delivo-logo.jpg";
import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { axiosInstance } from "../api/apiClient";
import { GET_REASONS, ORDER_LIST } from "../api/Constants";

function Home() {
  const {
    userInfo,
    setReasons,
    setRecieptTasks,
    setSendingTasks,
    recieptTasks,
    sendingTasks,
    reasons,
  } = useContext(Context);

  // get undelivered reasons
  const getReasons = async () => {
    const response = await axiosInstance.get(GET_REASONS);
    setReasons(response.data.response);
  };

  //get reciept tasks
  const getRecieptTasks = async () => {
    // Define parameters dynamically
    const params = {
      device_id: userInfo.device_id, // Example dynamic device ID
      pickup_task: true, // Dynamic pickup_task
      status: ["Waiting", "Accepted", "Completed", "Canceled"], // Dynamic status
    };

    // Safe Base64 Encoding
    const jsonData = JSON.stringify(params);
    const base64Data = btoa(jsonData);

    try {
      // Send GET request with encoded parameters
      const response = await axiosInstance.get(ORDER_LIST, {
        params: { tasklist_data: base64Data },
      });
      setRecieptTasks(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  //get sending tasks
  const getSendingTasks = async () => {
    // Define parameters dynamically
    const params = {
      device_id: userInfo.device_id, // Example dynamic device ID
      pickup_task: false, // Dynamic pickup_task
      status: ["Waiting", "Accepted", "Completed", "Canceled"], // Dynamic status
    };

    // Safe Base64 Encoding
    const jsonData = JSON.stringify(params);
    const base64Data = btoa(jsonData);

    try {
      // Send GET request with encoded parameters
      const response = await axiosInstance.get(ORDER_LIST, {
        params: { tasklist_data: base64Data },
      });
      setSendingTasks(response.data.response);
      // Log response
    } catch (error) {
      console.log(error);
    }
  };

  const [taskAmounts, setTaskAmounts] = useState({
    receiptAccepted: 0,
    receiptCompleted: 0,
    receiptCanceled: 0,
    receiptWaiting: 0,
    sendingAccepted: 0,
    sendingCompleted: 0,
    sendingCanceled: 0,
    sendingWaiting: 0,
  });

  const taskCounter = () => {
    const newTaskAmounts = {
      receiptAccepted: 0,
      receiptCompleted: 0,
      receiptCanceled: 0,
      receiptWaiting: 0,
      sendingAccepted: 0,
      sendingCompleted: 0,
      sendingCanceled: 0,
      sendingWaiting: 0,
    };

    recieptTasks.forEach((task) => {
      if (task.Status === "Accepted") {
        newTaskAmounts.receiptAccepted++;
      } else if (task.Status === "Completed") {
        newTaskAmounts.receiptCompleted++;
      } else if (task.Status === "Canceled") {
        newTaskAmounts.receiptCanceled++;
      } else {
        newTaskAmounts.receiptWaiting++;
      }
    });

    sendingTasks.forEach((task) => {
      if (task.Status === "Accepted") {
        newTaskAmounts.sendingAccepted++;
      } else if (task.Status === "Completed") {
        newTaskAmounts.sendingCompleted++;
      } else if (task.Status === "Canceled") {
        newTaskAmounts.sendingCanceled++;
      } else {
        newTaskAmounts.sendingWaiting++;
      }
    });

    setTaskAmounts(newTaskAmounts);
  };

  useEffect(() => {
    getReasons();
    getRecieptTasks();
    getSendingTasks();
    taskCounter();
    taskCounter();
  }, [recieptTasks, sendingTasks, reasons]);

  return (
    <div className="max-w-[100vw] min-h-[100vh] bg-yellow-300">
      <div className="flex flex-col gap-8 pt-20 px-20 pb-[128px]  max-sm:px-10">
        {/* logo container */}
        <div className="min-w-[238px]  flex items-center justify-between">
          <h2>ზოგადი ინფორმაცია</h2>
          <img src={logo} alt="logo" className="w-[50px]" />
        </div>

        {/* info section */}
        <section className="flex flex-col gap-6">
          <div className="flex  items-center gap-6">
            <FontAwesomeIcon icon={faUser} />
            <h2>{userInfo.name}</h2>
          </div>

          <div className="flex flex-col gap-2 bg-[#f4e1d2] max-w-[540px] p-4 rounded-xl">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faMoneyBill1} />
              <h3>ნაღდი ფული: </h3>
            </div>
            <div className="flex gap-2 items-center border-b-2 border-black pb-2">
              <FontAwesomeIcon icon={faMoneyCheckDollar} />
              <h3>ბარათი: </h3>
            </div>
            <h3>ჯამური თანხა: </h3>
          </div>
        </section>

        {/* parcel statistic section*/}

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b-2 border-black pb-6">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon icon={faBox} />
              <h2>შეკვეთების გამოტანა</h2>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between">
                <span>დასრულებული ვიზიტები:</span>
                <span>{taskAmounts.receiptCompleted}</span>
              </li>
              <li className="flex justify-between">
                <span>გაუქმებული ვიზიტები:</span>
                <span>{taskAmounts.receiptCanceled}</span>
              </li>
              <li className="flex justify-between">
                <span>აქტიური ვიზიტები:</span>
                <span>{taskAmounts.receiptAccepted}</span>
              </li>
              <li className="flex justify-between">
                <span>მოლოდინში:</span>
                <span>{taskAmounts.receiptWaiting}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-black pb-6">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon icon={faBox} />
              <h2>შეკვეთების ჩაბარება</h2>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between">
                <span>დასრულებული ვიზიტები:</span>
                <span>{taskAmounts.sendingCompleted}</span>
              </li>
              <li className="flex justify-between">
                <span>გაუქმებული ვიზიტები:</span>
                <span>{taskAmounts.sendingCanceled}</span>
              </li>
              <li className="flex justify-between">
                <span>აქტიური ვიზიტები:</span>
                <span>{taskAmounts.sendingAccepted}</span>
              </li>
              <li className="flex justify-between">
                <span>მოლოდინში:</span>
                <span>{taskAmounts.sendingWaiting}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
