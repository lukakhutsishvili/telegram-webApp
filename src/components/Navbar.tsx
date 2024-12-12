import { useState } from "react";

function Navbar() {
  const [active, setActive] = useState("");

  const handleClick = (name: string) => {
    setActive(name);
  };

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white shadow-md">
      <div className="flex justify-around py-4">
        {["Home", "Sending", "Receipt"].map((item) => (
          <div
            key={item}
            className={`cursor-pointer flex-1 text-center px-4 py-2 rounded-md transition-all ${
              active === item ? "bg-yellow-500 text-black" : "hover:bg-gray-400"
            }`}
            onClick={() => handleClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
