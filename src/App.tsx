import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Reciept from "./pages/Reciept";
import Sending from "./pages/Sending";
import { createContext, useState } from "react";
import axios from "axios";

function App() {
  const [foo, setFoo] = useState<string>("");

  const chat_id = 6087086146;

  type createContextType = {
    foo: string;
    setFoo: any;
  };

  const Context = createContext<createContextType>({
    foo: "foo",
    setFoo: () => {},
  });

  const username = "telegram_bot";
  const password = "657152";

  const encodedCredentials = btoa(`${username}:${password}`);

  const params: any = { telegram_id: chat_id };

  const axiosInstance = axios.create({
    baseURL: "https://bo.delivo.ge/delivo_test/hs/bot",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });

  const handleSignIn = async () => {
    try {
      const response = await axiosInstance.get("/auth", { params });
      console.log(response.data);
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div className=" hover:cursor-pointer" onClick={handleSignIn}>
        request
      </div>
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