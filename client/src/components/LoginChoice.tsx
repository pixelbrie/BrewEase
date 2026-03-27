import React from "react";

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
      className={`border border-gray-300 bg-white hover:bg-slate-50 p-4 rounded-lg w-full flex flex-row items-center gap-4 cursor-pointer ${props.className}`}
      onClick={props.onClick}
    >
      {props.icon && (
        <img src={props.icon} alt={`${props.label} icon`} className="size-20" />
      )}

      <div className="flex flex-col gap-1 text-left">
        <p className="text-black font-bold text-lg">{props.label}</p>
        <p className="text-sm text-gray-400">{props.description}</p>
      </div>
    </div>
  );
}

export default LoginChoice;
