import { Route, Routes, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import QRBarcodeScanner from "./components/Scanner";
import OrderPage from "./pages/OrderPage";

// Define the context type

// Default context value
const defaultContextValue: createContextType = {
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
};

// Create context
export const Context = createContext(defaultContextValue);

const App = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<Record<string, any>>({});
  const [reasons, setReasons] = useState<string[]>([]);
  const [navbarButtons, setNavbarButtons] = useState<string>("Home");
  const [recieptTasks, setRecieptTasks] = useState<any[]>([]);
  const [sendingTasks, setSendingTasks] = useState<any[]>([]);
  const [tabButtons, setTabButtons] = useState<string>("Waiting");

  // Initialize Telegram Web App
  useEffect(() => {
    const webApp = (window as any)?.Telegram?.WebApp;

    if (webApp) {
      // Prepare the Web App
      webApp.ready();
      webApp.expand();
      webApp.disableVerticalSwipes();

      // Log the initDataUnsafe to understand its structure
      console.log(
        "Telegram WebApp Initialized. initDataUnsafe:",
        webApp.initDataUnsafe
      );

      // Extract the user ID
      const userId = webApp.initDataUnsafe?.user?.id;

      if (userId) {
        console.log("User ID:", userId);
        setUserInfo((prev) => ({ ...prev, telegram_id: userId })); // Save the ID to state
      } else {
        console.error("User ID not found in initDataUnsafe.");
      }
    } else {
      console.error("Telegram WebApp is not available.");
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
      {location.pathname !== "/" && <Navbar />}
    </Context.Provider>
  );
};

export default App;
