import { faHome, faTruckFast, faBox } from "@fortawesome/free-solid-svg-icons";

// sending and reciept tab buttons
export const tabButtons = [
  { name: "accepted" , status: "Accepted"},
  { name: "completed", status: "Completed" },
  { name: "canceled", status: "Canceled" },
  { name: "waiting", status: "Waiting" },
];

// Navbar buttons
export  const buttons = [
  { name: "home", path: "/home", icon: faHome },
  { name: "sending", path: "/Sending", icon: faTruckFast },
  { name: "receipt", path: "/Reciept", icon: faBox },
];