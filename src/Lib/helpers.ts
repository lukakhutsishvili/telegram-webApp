import { faHome, faTruckFast, faBox, faBarcode,  } from "@fortawesome/free-solid-svg-icons";
import  GE  from "../assets/georgia.svg"
import  USA  from "../assets/usa.svg"
import  RU  from "../assets/russia.svg"

// sending and reciept tab buttons
export const TAB_BUTTONS = [
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
  { name: "scan the register", path: "/scanner", icon: faBarcode }
];



export const langButtons = [
  {name: "ქართული", lang: "ge", flag: GE},
  {name: "English", lang: "en", flag: USA},
  {name: "Русский", lang: "ru", flag: RU},
]