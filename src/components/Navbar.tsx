import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { buttons } from "../Lib/helpers";
import { useContext } from "react";
import { Context } from "../App";
import { t } from "i18next";

function Navbar() {
  const { setNavbarButtons } = useContext(Context);

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white shadow-md">
      <div className="flex justify-around py-2">
        {buttons.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `cursor-pointer flex-1 text-center px-2 py-2 rounded-md transition-all ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-400"
              }`
            }
            onClick={() => setNavbarButtons(item.name)} 
          >
            <div className="flex flex-col items-center gap-1">
              <FontAwesomeIcon icon={item.icon} size="lg" />
              <span className="text-[12px] md:text-base">{t(item.name)}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
