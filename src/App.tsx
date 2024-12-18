import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import QRBarcodeScanner from "./components/Scanner";

export const Context = createContext<createContextType>({
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
});
function App() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [reasons, setReasons] = useState();
  const [recieptTasks, setRecieptTasks] = useState();
  const [sendingTasks, setSendingTasks] = useState();
  const [tabButtons, setTabButtons] = useState("Waiting");

  // Launch telegram web app
  useEffect(() => {
    const webApp = window.Telegram.WebApp;
    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.disableVerticalSwipes();
      const userid = webApp.initDataUnsafe.chat?.id;
      if (userid) {
        // Update user state with ID
        setUserInfo((prevUser) => ({ ...prevUser, id: userid }));
      }
    }
  }, []);

  return (
    <>
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
        }}
      >
        <Routes>
          <Route element={<SignIn />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Reciept />} path="/Reciept" />
          <Route element={<Sending />} path="/Sending" />
          <Route path="/scanner" element={<QRBarcodeScanner />} />
        </Routes>
        {location.pathname !== "/" && <Navbar />}
      </Context.Provider>
    </>
  );
}

export default App;
