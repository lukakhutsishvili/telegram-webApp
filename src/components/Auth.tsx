
import { auth } from "../config/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";




export function Auth() {
    const [phoneNumber, setPhoneNumber]= useState("");

    const signIn= async () => {
      try {
      await signInWithPhoneNumber(auth, phoneNumber)
      } catch (error) {
        console.error(error)
      }
    } 

  return (
    <div>
      <input type="text" onChange={ (e) => setPhoneNumber(e.target.value)} />
      <button onClick={() => signIn()}>
        Sign in 
      </button> 
    </div>
  );
}

export default Auth
