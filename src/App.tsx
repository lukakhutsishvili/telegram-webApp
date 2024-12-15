import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [foo, setFoo] = useState<string>("");

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
    webApp;
    console.log(webApp.version);
    if (webApp) {
      webApp.ready();

      webApp.expand();
      webApp.disableVerticalSwipes();
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
