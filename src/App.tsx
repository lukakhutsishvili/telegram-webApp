import { Route, Routes, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import QRBarcodeScanner from "./components/Scanner";
import OrderPage from "./pages/OrderPage";
import RequestLog from "./pages/RequestLog";

const defaultContextValue: ContextType = {
  userInfo: {},
  setUserInfo: () => {},
  reasons: [],
  setReasons: () => {},
  recieptTasks: [],
  setRecieptTasks: () => {},
  sendingTasks: [],
  setSendingTasks: () => {},
  tabButtons: "Waiting",
  setTabButtons: () => {},
  navbarButtons: "Home",
  setNavbarButtons: () => {},
  amount: [{ cash: 0, bank: 0, sum: 0 }],
  setAmount: () => {},
  activeButton: 0,
  setActiveButton: () => {},
};

export const Context = createContext(defaultContextValue);

const App = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<Record<string, any>>({});
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [navbarButtons, setNavbarButtons] = useState<string>("Home");
  const [recieptTasks, setRecieptTasks] = useState<any[]>([]);
  const [sendingTasks, setSendingTasks] = useState<any[]>([]);
  const [tabButtons, setTabButtons] = useState<string>("Accepted");
  const [amount, setAmount] = useState([{ cash: 0, bank: 0, sum: 0 }]);
  const [activeButton, setActiveButton] = useState<number>(0);

  const [showPopup, setShowPopup] = useState(false);
  const [customUserId, setCustomUserId] = useState("");

  useEffect(() => {
    const webApp = (window as any)?.Telegram?.WebApp;

    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.disableVerticalSwipes();

      console.log("Telegram WebApp Initialized:", webApp.initDataUnsafe);

      if (
        webApp.initDataUnsafe?.user?.id == "1800276631" ||
        webApp.initDataUnsafe?.user?.id == "6087086146" ||
        !webApp.initDataUnsafe?.user?.id // Example of a custom user ID
      ) {
        setShowPopup(true);
      } else {
        setUserInfo((prev) => ({
          ...prev,
          telegram_id: webApp.initDataUnsafe?.user?.id,
        }));
      }
    }
  }, []);

  return (
    <Context.Provider
      value={{
        userInfo,
        setUserInfo,
        reasons,
        setReasons,
        recieptTasks,
        setRecieptTasks,
        sendingTasks,
        setSendingTasks,
        tabButtons,
        setTabButtons,
        navbarButtons,
        setNavbarButtons,
        amount,
        setAmount,
        activeButton,
        setActiveButton,
      }}
    >
      <Routes>
        <Route
          element={
            <SignIn
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              setCustomUserId={setCustomUserId}
              customUserId={customUserId}
            />
          }
          path="/"
        />
        <Route element={<Home />} path="/home" />
        <Route element={<Reciept />} path="/reciept" />
        <Route element={<Sending />} path="/sending" />
        <Route element={<QRBarcodeScanner />} path="/scanner" />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route element={<RequestLog />} path="/requestlog" />
      </Routes>
      {location.pathname.toLowerCase() === "/home" ||
      location.pathname.toLowerCase() === "/sending" ||
      location.pathname.toLowerCase() === "/reciept" ||
      location.pathname.toLowerCase() === "/scanner" ? (
        <Navbar />
      ) : (
        <div></div>
      )}
    </Context.Provider>
  );
};

export default App;
