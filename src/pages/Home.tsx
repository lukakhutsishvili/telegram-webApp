import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faMoneyCheckDollar, faBox } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/delivo-logo.jpg";
import { useContext, useEffect } from "react";
import { Context } from "../App";
import { axiosInstance } from "../api/apiClient";
import { GET_REASONS, ORDER_LIST } from "../api/Constants";

function Home() {
  const { userInfo, setReasons, setRecieptTasks, setSendingTasks } =
    useContext(Context);

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

  useEffect(() => {
    getReasons();
    getRecieptTasks();
    getSendingTasks();
  }, []);

  return (
    <div className="max-w-[100vw] min-h-[100vh] bg-yellow-300">
      <div className="flex flex-col gap-8 p-20  max-sm:px-10">
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
            <div className="flex flex-col gap-2">
              <h3>შესრულებული ვიზიტები: </h3>
              <h3>შეუსრულებული ვიზიტები: </h3>
              <h3>დასასრულებებლი ვიზიტები: </h3>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-black pb-6">
            <div className="flex items-center gap-5">
              <FontAwesomeIcon icon={faBox} />
              <h2>შეკვეთების ჩაბარება</h2>
            </div>
            <div className="flex flex-col gap-2">
              <h3>შესრულებული ვიზიტები: </h3>
              <h3>შეუსრულებული ვიზიტები: </h3>
              <h3>დასასრულებებლი ვიზიტები: </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
