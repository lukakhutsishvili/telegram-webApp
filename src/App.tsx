import { Route, Routes } from "react-router-dom";
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
    if (window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Notify Telegram the app is ready
      webApp.ready();

      // Request to expand the app to full screen
      webApp.expand();
    }
  }, []);

  return (
    <>
      <Context.Provider value={{ foo, setFoo }}>
        <Routes>
          <Route element={<Home />} path="/home" />
          <Route element={<SignIn />} path="/" />
          <Route element={<Reciept />} path="/Reciept" />
          <Route element={<Sending />} path="/Sending" />
        </Routes>
        <Navbar />
      </Context.Provider>
    </>
  );
}

export default App;
