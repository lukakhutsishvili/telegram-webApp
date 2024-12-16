import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";

export const Context = createContext<createContextType>({
  userInfo: {},
  setUserInfo: () => {},
  reasons: [],
  setReasons: () => {}
});
function App() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [reasons, setReasons] = useState();

  // Launch telegram web app
  useEffect(() => {
    const webApp = window.Telegram.WebApp;
    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.disableVerticalSwipes();
      const userid = webApp.initDataUnsafe.user?.id;
      if (userid) {
        // Update user state with ID
        setUserInfo((prevUser) => ({ ...prevUser, id: userid }));
      }
    }
  }, []);

  return (
    <>
      <Context.Provider value={{ userInfo, setUserInfo, reasons, setReasons  }}>
        <Routes>
          <Route element={<SignIn />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Reciept />} path="/Reciept" />
          <Route element={<Sending />} path="/Sending" />
        </Routes>
        {location.pathname !== "/" && <Navbar />}
      </Context.Provider>
    </>
  );
}

export default App;
