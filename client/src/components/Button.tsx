import React from "react";
import { IconContext } from "react-icons";

interface ButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Button component with variants and sizes
 * @param {string} [className] - Additional CSS classes for the button
 * @param {"primary"|"secondary"} [variant] - The variant of the button
 * @param {"small"|"medium"|"large"} [size] - The size of the button
 * @param {string} [label] - The text to display on the button
 * @param {boolean} [disabled] - Whether the button is disabled
 * @param {React.ReactNode} [icon] - The icon to display on the button
 * @param {() => void} [onClick] - The function to call when the button is clicked
 */

function Button({
  className = "",
  variant = "primary",
  size = "medium",
  label = "Button",
  disabled = false,
  onClick,
  icon,
}: ButtonProps) {
  // Render the button based on the variant and size
  switch (variant) {
    case "primary":
      return (
        <button
          className={`flex flex-row bg-coffee-600 hover:bg-coffee-900 text-white font-bold py-6 px-32 rounded-full ${size === "small" ? "text-sm" : size === "large" ? "text-lg" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {<span className="mt-1.5">{label}</span>}
          <IconContext.Provider value={{ size: "2em", color: "white" }}>
            {icon && <span className="ml-4">{icon}</span>}
          </IconContext.Provider>
        </button>
      );
    case "secondary":
      return (
        <button
          className={`flex flex-row hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-full ${size === "small" ? "text-sm" : size === "large" ? "text-lg" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {<span className="">{label}</span>}
          <IconContext.Provider value={{ size: "1.5em" }}>
            {icon && <span className="ml-4">{icon}</span>}
          </IconContext.Provider>
        </button>
      );
    default:
      return (
        <button
          className={`flex flex-row bg-coffee-500 hover:bg-coffee-700 text-white font-bold py-6 px-32 rounded-full ${size === "small" ? "text-sm" : size === "large" ? "text-lg" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
          <IconContext.Provider value={{ size: "1.5em" }}>
            {icon && <span className="ml-2">{icon}</span>}
          </IconContext.Provider>
        </button>
      );
  }
}

export default Button;
