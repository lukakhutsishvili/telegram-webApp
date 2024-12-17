import { faHome, faTruckFast, faBox } from "@fortawesome/free-solid-svg-icons";

// sending and reciept tab buttons
export const tabButtons = [
  { name: "აქტიური" },
  { name: "დასრულებული" },
  { name: "გაუქმებული" },
  { name: "დასადასტურებელი" },
];

// Navbar buttons
export  const buttons = [
  { name: "Home", path: "/home", icon: faHome },
  { name: "Sending", path: "/Sending", icon: faTruckFast },
  { name: "Receipt", path: "/Reciept", icon: faBox },
];