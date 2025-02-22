import { useAuth } from "../hooks/useAuth";
import { useContext, useEffect } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Register from "../components/Register";

const SignIn = () => {
  const { handleSignIn, signInloader } = useAuth();

  const navigate = useNavigate();
  const { userInfo } = useContext(Context);

  useEffect(() => {
    handleSignIn();
  }, [userInfo, navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      {signInloader ? <Spinner /> : <Register />}
    </div>
  );
};

export default SignIn;
