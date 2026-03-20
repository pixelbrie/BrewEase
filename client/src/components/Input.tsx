import React from "react";

interface InputProps {
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  classname?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  length?: number;
}

/**
 * Input component with custom styles
 * @param {React.ReactNode} [icon] - The icon to display inside the input
 * @param {string} [placeholder] - The placeholder text for the input
 * @param {string} [type] - The type of the input
 * @param {string} [classname] - Additional class names for the input
 * @param {number} [length] - The maximum length of the input
 * @returns {JSX.Element} The rendered Input component
 */

function Input({
  icon,
  placeholder,
  type,
  classname,
  value,
  onChange,
  length,
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-4 flex items-center text-coffee-600 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type || "text"}
          placeholder={placeholder || "Enter text"}
          value={value}
          onChange={onChange}
          maxLength={length}
          className={`text-black ${icon ? "pl-10" : "px-4"} py-4 w-full rounded-lg border-2 focus:outline-none border-gray-200 focus:border-3 focus:ring-coffee-600 focus:border-coffee-600 focus:ring-2 focus:ring-opacity-50 transition duration-300 ease-in-out ${classname || ""}`}
        />
      </div>
    </div>
  );
}

export default Input;
