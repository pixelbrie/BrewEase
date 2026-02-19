import React from "react";

interface InputProps {
  placeholder?: string;
  type?: string;
  classname?: string;
}

/**
 * Input component with custom styles
 * @param {string} [placeholder] - The placeholder text for the input
 * @param {string} [type] - The type of the input
 * @param {string} [classname] - Additional class names for the input
 */

function Input({ placeholder, type, classname }: InputProps) {
  return (
    <input
      type={type || "text"}
      placeholder={placeholder || "Enter text"}
      className={`text-black px-4 py-2 rounded-full border-2 focus:outline-none border-coffee-500 focus:border-3 focus:ring-coffee-600 focus:border-coffee-600 focus:ring-2 focus:ring-opacity-50 transition duration-300 ease-in-out ${classname || ""}`}
    />
  );
}

export default Input;
