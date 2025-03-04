import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  type?: "button" | "submit" | "reset"; // Restrict to valid button types

}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  isActive = false,
  type = "button", // Default value is still valid
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
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
