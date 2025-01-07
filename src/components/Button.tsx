import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  isActive = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold rounded-md w-full text-black text-[14px] ${
        isActive ? "bg-yellow-600" : "bg-yellow-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

