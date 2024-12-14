import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTruckFast, faBox } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const buttons = [
    { name: "Home", path: "/home", icon: faHome },
    { name: "Sending", path: "/Sending", icon: faTruckFast },
    { name: "Receipt", path: "/Reciept", icon: faBox },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white shadow-md">
      <div className="flex justify-around py-4">
        {buttons.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `cursor-pointer flex-1 text-center px-4 py-2 rounded-md transition-all ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-400"
              }`
            }
          >
            <div className="flex flex-col items-center gap-1">
              <FontAwesomeIcon icon={item.icon} size="lg" />
              <span>{item.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
