import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faMoneyCheckDollar, faBox } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/delivo-logo.webp";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../App";
import { axiosInstance } from "../api/apiClient";
import { AMOUNT, GET_REASONS, ORDER_LIST } from "../api/Constants";
import { t } from "i18next";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
    setTabButtons,
    setActiveButton
  } = useContext(Context);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      try {
        await fetchRecieptTasks();
        await fetchSendingTasks();
        await fetchAmount();
        await fetchReasons();
      } catch (error) {
        console.log(error);  // changed alert to console.error
      } finally {
        setLoading(false);
      }
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

  interface HandleNavigateToPagesParams {
    buttonName: string;
    path: string;
    num: number;
  }

  const handleNavigeteToPages = ({ buttonName, path , num}: HandleNavigateToPagesParams): void => {
    setTabButtons(buttonName);
    setActiveButton(num);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300">
      <div className="container mx-auto px-6 pt-24 h-sm:pt-10 pb-[100px] max-sm:px-4">
        {/* Logo and Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("General Information")}
          </h2>
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>

        {/* Spinner animation */}
        <div className="h-8  flex items-center justify-center">
          {loading && (
            <div className="flex items-center justify-center mb-6">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-yellow-500 text-3xl animate-spin mr-4"
              />
              <p className="text-red-500 font-medium">
                {t("please wait until information is loaded")}
              </p>
            </div>
          )}
        </div>
        {/* Info Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FontAwesomeIcon
              icon={faUser}
              className="text-yellow-500 text-xl"
            />
            <h2 className="text-lg font-semibold text-gray-700">
              {userInfo.name}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon
                  icon={faMoneyBill1}
                  className="text-yellow-500"
                />
                <h3 className="text-gray-700">{t("Cash")}:</h3>
              </div>
              <p className="text-gray-800 font-semibold">{amount?.[0]?.cash}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon
                  icon={faMoneyCheckDollar}
                  className="text-yellow-500"
                />
                <h3 className="text-gray-700">{t("Bank")}:</h3>
              </div>
              <p className="text-gray-800 font-semibold">{amount?.[0]?.bank}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg">
              <h3 className="text-gray-700">{t("Total Amount")}:</h3>
              <p className="text-gray-800 font-semibold">{amount?.[0]?.sum}</p>
            </div>
          </div>
        </section>

        {/* Parcel Statistics */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Orders */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <FontAwesomeIcon
                  icon={faBox}
                  className="text-yellow-500 text-xl"
                />
                <h2 className="text-lg font-semibold text-gray-700">
                  {t("Receipt orders")}
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Completed', path: '/Reciept' , num: 1 })}
                    className="text-black font-bold underline cursor-pointer"
                    >{t("Completed Visits")}:</span>
                  <span>{taskAmounts.receiptCompleted}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Canceled', path: '/Reciept', num: 2 })}
                    className="text-black font-bold underline cursor-pointer"
                    >{t("Canceled Visits")}:</span>
                  <span>{taskAmounts.receiptCanceled}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Accepted', path: '/Reciept' , num: 0 })}
                    className="text-black font-bold underline cursor-pointer"
                    >{t("Active Visits")}:</span>
                  <span>{taskAmounts.receiptAccepted}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Waiting', path: '/Reciept' , num: 3})}
                    className="text-black font-bold underline cursor-pointer"
                    >{t("Waiting")}:</span>
                  <span>{taskAmounts.receiptWaiting}</span>
                </li>
              </ul>
            </div>

            {/* Sending Orders */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <FontAwesomeIcon
                  icon={faBox}
                  className="text-yellow-500 text-xl"
                />
                <h2 className="text-lg font-semibold text-gray-700">
                  {t("Sending orders")}
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Completed', path: '/Sending', num: 1 })}
                    className="text-black font-bold underline cursor-pointer"
                    >{t("Completed Visits")}:</span>
                  <span>{taskAmounts.sendingCompleted}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Canceled', path: '/Sending', num: 2 })}
                    className="text-black font-bold underline cursor-pointer">
                    {t("Canceled Visits")}:
                    </span>
                  <span>{taskAmounts.sendingCanceled}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Accepted', path: '/Sending', num: 0 })}
                   className="text-black font-bold underline cursor-pointer" >
                    {t("Active Visits")}:</span>
                  <span>{taskAmounts.sendingAccepted}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span onClick={() => handleNavigeteToPages({ buttonName: 'Waiting', path: '/Sending', num: 3 })}
                    className="text-black font-bold underline cursor-pointer">
                      {t("Waiting")}:</span>
                  <span>{taskAmounts.sendingWaiting}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <Button onClick={() => navigate('/requestlog')}>Open Chat</Button>
        </section>
      </div>
    </div>
  );
}

export default Home;
