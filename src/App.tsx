import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [foo, setFoo] = useState<string>("");
  // const [isAppActive, setIsAppActive] = useState();

  type createContextType = {
    foo: string;
    setFoo: any;
  };

  const Context = createContext<createContextType>({
    foo: "foo",
    setFoo: () => {},
  });
  useEffect(() => {
    // Ensure the Telegram WebApp is initialized
    const webApp = window.Telegram.WebApp;

    if (webApp) {
      // Notify Telegram the app is ready
      webApp.ready();

      // Request to expand the app to full screen
      webApp.expand();

      webApp.disableClosingConfirmation();

      // Set the app active state based on Telegram's API
      // setIsAppActive(webApp.initData);

      // Listen for viewport changes to track app folding/unfolding
      // webApp.onEvent("viewportChanged", () => {
      //   setIsAppActive(webApp.isActive);
      // });

      // Cleanup on component unmount
      // return () => {
      //   webApp.offEvent("viewportChanged", () => {
      //     setIsAppActive(webApp.isActive);
      //   });
      // };
    }
  }, []);

  const location = useLocation();

  return (
    <>
      <Context.Provider value={{ foo, setFoo }}>
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
