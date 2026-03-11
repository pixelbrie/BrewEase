import React from "react";
import GuestChoiceImg from "../assets/images/img-GuestSelection.png";

interface LoginChoiceProps {
  // You can add props here if needed, such as a callback function for when a choice is made
  label: string;
  description: string;
  onClick: () => void;
  icon?: string;
  className?: string;
}
function LoginChoice(props: LoginChoiceProps) {
  return (
    <div
      className={`border border-gray-300 bg-white p-4 rounded-lg w-full flex flex-row items-center gap-4 cursor-pointer ${props.className}`}
      onClick={props.onClick}
    >
      {props.icon && (
        <img
          src={props.icon}
          alt={`${props.label} icon`}
          className="w-12 h-12"
        />
      )}

      <div>
        <p className="font-bold text-black">{props.label}</p>
        <p className="text-sm text-gray-500">{props.description}</p>
      </div>
    </div>
  );
}

export default LoginChoice;
