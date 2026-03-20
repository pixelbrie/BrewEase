import React, { useState } from "react";
import { motion } from "motion/react";
import SelectionLoginContainer from "./SelectionLoginContainer.js";
import CustomerLoginContainer from "./CustomerLoginContainer.js";
import EmployeeLoginContainer from "./EmployeeLoginContainer.js";

interface LoginContainerProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  navigate: (path: string) => void;
}

function LoginContainer({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  navigate,
}: LoginContainerProps) {
  const [selectedType, setSelectedType] = useState<
    "customer" | "employee" | "guest" | null
  >(null);

  const handleSelect = (type: "customer" | "employee" | "guest") => {
    setSelectedType(type);
  };

  // Determine which content to show based on the selected login type

  let content;

  // Show the appropriate login container based on the selected type
  if (selectedType === "customer") {
    content = (
      <CustomerLoginContainer
        email={email}
        password={password}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onClose={() => setSelectedType(null)}
      />
    );
  } else if (selectedType === "employee") {
    content = (
      <EmployeeLoginContainer
        email={email}
        password={password}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onClose={() => setSelectedType(null)}
      />
    );
  } else if (selectedType === "guest") {
    // You can add a GuestLoginContainer if needed
    content = <div className="text-neutral-400">Guest login coming soon!</div>;
  } else {
    content = <SelectionLoginContainer onSelect={handleSelect} />;
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg"
    >
      {content}
    </motion.div>
  );
}

export default LoginContainer;
