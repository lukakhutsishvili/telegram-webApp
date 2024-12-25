import { faHome, faTruckFast, faBox } from "@fortawesome/free-solid-svg-icons";

// sending and reciept tab buttons
export const tabButtons = [
  { name: "აქტიური" , status: "Accepted"},
  { name: "დასრულებული", status: "Completed" },
  { name: "გაუქმებული", status: "Canceled" },
  { name: "მოლოდინში", status: "Waiting" },
];

// Navbar buttons
export  const buttons = [
  { name: "Home", path: "/home", icon: faHome },
  { name: "Sending", path: "/Sending", icon: faTruckFast },
  { name: "Receipt", path: "/Reciept", icon: faBox },
];