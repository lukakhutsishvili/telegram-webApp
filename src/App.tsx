import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useState } from "react";

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

  return (
    <>
      <Context.Provider value={{ foo, setFoo }}>
        <Routes>
          <Route element={<Home />} path="/home" />
          <Route element={<SignIn />} path="/" />
          <Route element={<Reciept />} path="/Reciept" />
          <Route element={<Sending />} path="/Sending" />
        </Routes>
      </Context.Provider>
    </>
  );
}

export default App;
