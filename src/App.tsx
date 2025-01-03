import { Route, Routes, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import QRBarcodeScanner from "./components/Scanner";
import OrderPage from "./pages/OrderPage";


interface Reason {
  reason_code: string;
  reason_description: string;
  reason_text?: string;
}

interface ContextType {
  userInfo: Record<string, any>;
  setUserInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  reasons: Reason[];
  setReasons: React.Dispatch<React.SetStateAction<Reason[]>>;
  recieptTasks: any[];
  setRecieptTasks: React.Dispatch<React.SetStateAction<any[]>>;
  sendingTasks: any[];
  setSendingTasks: React.Dispatch<React.SetStateAction<any[]>>;
  tabButtons: string;
  setTabButtons: React.Dispatch<React.SetStateAction<string>>;
  navbarButtons: string;
  setNavbarButtons: React.Dispatch<React.SetStateAction<string>>;
  amount: any;
  setAmount: any;
}

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
};

export const Context = createContext(defaultContextValue);

const App = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<Record<string, any>>({});
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [navbarButtons, setNavbarButtons] = useState<string>("Home");
  const [recieptTasks, setRecieptTasks] = useState<any[]>([]);
  const [sendingTasks, setSendingTasks] = useState<any[]>([]);
  const [tabButtons, setTabButtons] = useState<string>("Waiting");
  const [amount, setAmount] = useState([{ cash: 0, bank: 0, sum: 0 }]);

  useEffect(() => {
    const webApp = (window as any)?.Telegram?.WebApp;

    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.disableVerticalSwipes();

      console.log("Telegram WebApp Initialized:", webApp.initDataUnsafe);
      const userId = webApp.initDataUnsafe?.user?.id;

      if (userId) {
        setUserInfo((prev) => ({ ...prev, telegram_id: userId }));
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
      }}
    >
      <Routes>
        <Route element={<SignIn />} path="/" />
        <Route element={<Home />} path="/home" />
        <Route element={<Reciept />} path="/reciept" />
        <Route element={<Sending />} path="/sending" />
        <Route element={<QRBarcodeScanner />} path="/scanner" />
        <Route path="/order/:id" element={<OrderPage />} />
      </Routes>
      {location.pathname !== "/" && location.pathname !== "/scanner" && (
        <Navbar />
      )}
    </Context.Provider>
  );
};

export default App;
