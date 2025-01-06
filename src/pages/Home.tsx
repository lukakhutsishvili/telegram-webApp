import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faMoneyCheckDollar, faBox } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/delivo-logo.jpg";
import { useContext, useEffect, useMemo } from "react";
import { Context } from "../App";
import { axiosInstance } from "../api/apiClient";
import { AMOUNT, GET_REASONS, ORDER_LIST } from "../api/Constants";
import { t } from "i18next";

function Home() {
  const {
    userInfo,
    setReasons,
    setRecieptTasks,
    setSendingTasks,
    recieptTasks,
    sendingTasks,
    amount,
    setAmount,
  } = useContext(Context);

  // Fetch reasons
  const fetchReasons = async () => {
    try {
      const response = await axiosInstance.get(GET_REASONS);
      setReasons(response.data.response);
    } catch (error) {
      console.error("Error fetching reasons:", error);
    }
  };

  // Fetch amount
  const fetchAmount = async () => {
    try {
      const response = await axiosInstance.get(AMOUNT, {
        params: {
          cashregistry_data: btoa(
            JSON.stringify({
              device_id: userInfo.device_id,
            })
          ),
        },
      });
      setAmount(response.data.response);
    } catch (error) {
      console.error("Error fetching amount:", error);
    }
  };

  // Fetch receipt tasks
  const fetchRecieptTasks = async () => {
    try {
      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(
            JSON.stringify({
              device_id: userInfo.device_id,
              pickup_task: true,
              status: ["Waiting", "Accepted", "Completed", "Canceled"],
            })
          ),
        },
      });
      setRecieptTasks(response.data.response);
    } catch (error) {
      console.error("Error fetching receipt tasks:", error);
    }
  };

  // Fetch sending tasks
  const fetchSendingTasks = async () => {
    try {
      const response = await axiosInstance.get(ORDER_LIST, {
        params: {
          tasklist_data: btoa(
            JSON.stringify({
              device_id: userInfo.device_id,
              pickup_task: false,
              status: ["Waiting", "Accepted", "Completed", "Canceled"],
            })
          ),
        },
      });
      setSendingTasks(response.data.response);
    } catch (error) {
      console.error("Error fetching sending tasks:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchReasons();
      await fetchAmount();
      await fetchRecieptTasks();
      await fetchSendingTasks();
    };

    fetchAllData();
  }, []);

  // Calculate task amounts using useMemo
  const taskAmounts = useMemo(() => {
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
      if (task.Status === "Accepted") newTaskAmounts.receiptAccepted++;
      else if (task.Status === "Completed") newTaskAmounts.receiptCompleted++;
      else if (task.Status === "Canceled") newTaskAmounts.receiptCanceled++;
      else newTaskAmounts.receiptWaiting++;
    });

    sendingTasks.forEach((task) => {
      if (task.Status === "Accepted") newTaskAmounts.sendingAccepted++;
      else if (task.Status === "Completed") newTaskAmounts.sendingCompleted++;
      else if (task.Status === "Canceled") newTaskAmounts.sendingCanceled++;
      else newTaskAmounts.sendingWaiting++;
    });

    return newTaskAmounts;
  }, [recieptTasks, sendingTasks]);

  return (
    <div className=" min-h-[100vh] bg-yellow-300">
      <div className="flex flex-col gap-8 pt-20 px-20 pb-[128px] max-sm:px-10">
        {/* Logo container */}
        <div className="min-w-[238px] flex items-center justify-between">
          <h2>{t("General Information")}</h2>
          <img src={logo} alt="logo" className="w-[50px]" />
        </div>

        {/* Info section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <FontAwesomeIcon icon={faUser} />
            <h2>{userInfo.name}</h2>
          </div>

          <div className="flex flex-col gap-2 bg-[#f4e1d2] max-w-[540px] p-4 rounded-xl">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faMoneyBill1} />
              <h3>{t("Cash")}:</h3>
              <p className="ml-auto">{amount?.[0]?.cash}</p>
            </div>
            <div className="flex gap-2 items-center border-b-2 border-black pb-2">
              <FontAwesomeIcon icon={faMoneyCheckDollar} />
              <h3>{t("Bank")}: </h3>
              <p className="ml-auto">{amount?.[0]?.bank}</p>
            </div>
            <div className="flex gap-2 items-center">
              <h3>{t("Total Amount")}: </h3>
              <p className="ml-auto">{amount?.[0]?.sum}</p>
            </div>
          </div>
        </section>

        {/* Parcel statistics section */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b-2 border-black pb-6">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon icon={faBox} />
              <h2>{t("Receipt orders")}</h2>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between">
                <span>{t("Completed Visits")}:</span>
                <span>{taskAmounts.receiptCompleted}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Canceled Visits")}:</span>
                <span>{taskAmounts.receiptCanceled}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Active Visits")}:</span>
                <span>{taskAmounts.receiptAccepted}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Waiting")}:</span>
                <span>{taskAmounts.receiptWaiting}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-black pb-6">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon icon={faBox} />
              <h2>{t("Sending orders")}</h2>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between">
                <span>{t("Completed Visits")}:</span>
                <span>{taskAmounts.sendingCompleted}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Canceled Visits")}:</span>
                <span>{taskAmounts.sendingCanceled}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Active Visits")}:</span>
                <span>{taskAmounts.sendingAccepted}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("Waiting")}:</span>
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
